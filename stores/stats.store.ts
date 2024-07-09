import {action, computed, makeObservable, observable} from "mobx";
import {game} from "./game.store.ts";
import {type GameStats} from "../interfaces/game_stats.ts";

class StatsStore
{
	@observable data?: GameStats;

	constructor()
	{
		makeObservable(this);
		this.getStats();
	}

	@action
	getStats()
	{
		const stats = localStorage.getItem('stats');
		if (!stats)
		{
			this.data = {
				averageGuesses: 0,
				currentStreak: 0,
				gamesPlayed: 0,
				gamesWon: 0,
				gamesLost: 0,
				guesses: {
					1: 0,
					2: 0,
					3: 0,
					4: 0,
					5: 0,
					6: 0,
				},
				maxStreak: 0,
			};
			localStorage.setItem('stats', JSON.stringify(this.data));
		}
		else
			this.data = JSON.parse(stats);
	}

	@computed
	get winPercentage()
	{
		return Math.round((this.data!.gamesWon / this.data!.gamesPlayed) * 100);
	}

	@action
	finishGame()
	{
		this.data!.gamesPlayed++;

		const {state} = game;

		if (state?.gameStatus === 'WIN')
		{
			this.data!.gamesWon++;
			this.data!.currentStreak++;
			this.data!.maxStreak = Math.max(this.data!.maxStreak, this.data!.currentStreak);
			this.data!.guesses[state.rowIndex + 1]++;
		}
		else if (state?.gameStatus === 'FAIL')
		{
			this.data!.gamesLost++;
			this.data!.currentStreak = 0;
		}
		this.data!.averageGuesses = this.data!.gamesPlayed > 0 ? this.data!.guesses[1] / this.data!.gamesPlayed : 0;
		localStorage.setItem('stats', JSON.stringify(this.data));
	}
}

export const stats = new StatsStore();
