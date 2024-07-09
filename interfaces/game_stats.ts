export interface GameStats
{
	averageGuesses: number;
	currentStreak: number;
	gamesPlayed: number;
	gamesWon: number;
	gamesLost: number;
	guesses: { [key: number]: number };
	maxStreak: number;
}
