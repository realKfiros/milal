import {action, computed, makeObservable, observable} from "mobx";
import moment from "moment";
import Notify from "simple-notify";
import words from "@/autogen/words";
import beautiful_words from "@/autogen/beautiful_words";
import {GameStatus} from "@/interfaces/game_status.ts";
import {stats} from "./stats.store.ts";
import {shareOrCopy} from "@/components/share_or_copy.tsx";
import {confetti} from "./confetti.store.ts";
import {type GameState} from "@/interfaces/game_state.ts";

class GameStore
{
	@observable state?: GameState;
	@observable finished: boolean = false;
	@observable rowShake: boolean = false;
	@observable shake: boolean = false;

	constructor()
	{
		makeObservable(this);
		this.getTodayWord();
	}

	@action
	getTodayWord()
	{
		const gameState = localStorage.getItem("gameState");
		if (!gameState || JSON.parse(gameState).day !== moment().format("YYYY-MM-DD") || JSON.parse(gameState).dictionary_version !== process.env.DICTIONARY_VERSION)
		{
			fetch('/api/today').then(response => response.json()).then(todayWord =>
			{
				this.state = {
					boardStatus: ["", "", "", "", "", ""],
					evaluations: [null, null, null, null, null],
					gameStatus: GameStatus.IN_PROGRESS,
					day: moment().format("YYYY-MM-DD"),
					hardMode: false,
					rowIndex: 0,
					solution: todayWord,
					dictionary_version: process.env.DICTIONARY_VERSION,
				};
				localStorage.setItem("gameState", JSON.stringify(this.state));
			});
		}
		else
			this.state = JSON.parse(gameState);
	}

	@computed
	get currentWord(): string
	{
		return game.state?.boardStatus[this.rowIndex] || "";
	}

	@computed
	get rowIndex(): number
	{
		return game.state?.rowIndex || 0;
	}

	@computed
	get board()
	{
		const arr: string[][] = [];
		if (game.state)
		{
			for (const [index, evaluation] of Array.from(game.state!.evaluations.entries()))
			{
				const row: string[] = [];
				if (evaluation)
				{
					for (const [position, letter] of Array.from(Array.from(game.state!.boardStatus[index]).entries()))
					{
						if (letter === game.state?.solution?.[position])
							row.push("correct");
						else if (game.state?.solution?.includes(letter) && this.firstAppearance(position, letter, index))
							row.push("present");
						else
							row.push("absent");
					}
					arr.push(row);
				}
			}
		}
		return arr;
	}

	firstAppearance(position: number, letter: string, index: number)
	{
		const arr: string[] = Array.from(game.state?.boardStatus ?? []);
		return arr[index].indexOf(letter) === position;
	}

	@computed
	get shareText()
	{
		let text = "";
		text += `מילהל ${moment().format("DD/MM/YYYY")}`;
		if (game.state?.gameStatus === GameStatus.WIN)
			text += ` ${this.rowIndex + 1}/6`;
		text += "\n\n";
		for (let row = 0; row <= this.rowIndex; row++)
		{
			const _row: string[] = [];
			for (const evaluation of this.board[row])
			{
				if (evaluation === "correct")
					_row.push("🟩");
				else if (evaluation === "present")
					_row.push("🟨");
				else
					_row.push("⬛️");
			}
			text += _row.reverse().join("");
			text += "\n";
		}
		return text;
	}

	@computed
	get keyboardColors()
	{
		const correct = new Set();
		const present = new Set();
		const absent = new Set();
		for (const evaluation of game.state?.evaluations || [])
		{
			for (const [position, letter] of Array.from(Array.from(evaluation || "").entries()))
			{
				if (letter === game.state?.solution[position])
				{
					if (present.has(letter))
						present.delete(letter);
					correct.add(letter);
				}
				else if (game.state?.solution.includes(letter))
					present.add(letter);
				else
					absent.add(letter);
			}
		}
		return [
			correct.size > 0 && {
				class: "correct",
				buttons: Array.from(correct).join(" "),
			},
			present.size > 0 && {
				class: "present",
				buttons: Array.from(present).join(" "),
			},
			absent.size > 0 && {
				class: "absent",
				buttons: Array.from(absent).join(" "),
			},
		].filter((f) => !!f);
	}

	@action
	shakeRow = () =>
	{
		this.shake = true;
		setTimeout(() => this.shake = false, 1000);
	}

	@action.bound
	async write(value: string)
	{
		if (game.state?.gameStatus === GameStatus.IN_PROGRESS)
		{
			switch (value)
			{
				case "{backspace}":
					if (this.currentWord.length > 0)
						game.state!.boardStatus[this.rowIndex] = this.currentWord.slice(0, -1);
					break;
				case "{enter}":
					await this.enter();
					break;
				default:
					if ((this.currentWord || "").length < 5)
					{
						game.state!.boardStatus[this.rowIndex] += value;
						// await this.animateSqr("scale");
					}
					break;
			}
		}
	}

	@action.bound
	async enter()
	{
		const base = {
			status: "warning",
			customIcon: "🤔",
			customClass: "rtl",
			effect: "slide",
			autoclose: true,
			autotimeout: 1000,
			position: "x-center top",
		};
		if (beautiful_words[this.currentWord])
		{
			new Notify({
				...base,
				title: this.currentWord,
				text: beautiful_words[this.currentWord].message,
				customIcon: beautiful_words[this.currentWord].customIcon,
				status: undefined,
			} as object);
			if (beautiful_words[this.currentWord].confetti)
				confetti.shoot({
					preset: beautiful_words[this.currentWord].confetti?.preset || '',
					text: beautiful_words[this.currentWord].confetti?.preset === "custom" ? beautiful_words[this.currentWord].customIcon : "",
					options: beautiful_words[this.currentWord].confetti?.options,
				});
			game.state!.boardStatus[this.rowIndex] = "";
			return;
		}
		else if (this.currentWord.length < 5)
		{
			new Notify({
				...base,
				title: "אין מספיק אותיות",
			} as object);

			this.shakeRow()

			return;
		}
		else if (!words[this.currentWord])
		{
			new Notify({
				...base,
				title: "מילה לא קיימת",
			} as object);

			this.shakeRow()

			return;
		}

		game.state!.evaluations[this.rowIndex] = this.currentWord;

		if (this.currentWord === game.state?.solution)
			game.state!.gameStatus = GameStatus.WIN;
		else if (game.state?.rowIndex === 5)
			game.state!.gameStatus = GameStatus.FAIL;
		else
			game.state!.rowIndex++;
		localStorage.setItem("gameState", JSON.stringify(game.state));
		if (game.state!.gameStatus !== GameStatus.IN_PROGRESS)
			stats.finishGame();
	}

	@action.bound
	onFinish()
	{
		if (this.finished)
			return;
		this.finished = true;
		let notification;
		let notify = true;
		switch (game.state?.gameStatus)
		{
			case GameStatus.WIN:
				confetti.shoot({preset: 'crossfire'});
				notification = {
					customIcon: "🏆",
					status: "success",
					title: "כל הכבוד!",
				} as object;
				break;
			case GameStatus.FAIL:
				confetti.shoot({preset: 'custom', text: '💩'});
				notification = {
					customIcon: "💩",
					status: "error",
					title: `המילה היא ${game.state?.solution}...`,
				};
				break;
			default:
				notify = false;
				break;
		}
		if (notify)
			new Notify({
				...notification,
				text: shareOrCopy,
				customClass: "rtl",
				position: "x-center top",
			});
	}
}

export const game = new GameStore();
