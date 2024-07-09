import {GameStatus} from "./game_status.ts";

export interface GameState
{
	boardStatus: string[];
	evaluations: (null | string)[];
	gameStatus: GameStatus;
	day: string;
	hardMode: boolean;
	rowIndex: number;
	solution: string;
}
