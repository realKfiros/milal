import {ConfettiShoot} from "./confetti_shoot.ts";

export interface BeautifulWordsfile
{
	[key: string]: {
		message: string;
		customIcon: string
		confetti?: ConfettiShoot
	}
}
