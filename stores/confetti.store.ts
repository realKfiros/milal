import {action, makeObservable, observable} from "mobx";
import {type TCanvasConfettiAnimationOptions} from "react-canvas-confetti/dist/types";
import {type ConfettiShoot} from "@/interfaces/confetti_shoot";


class ConfettiStore
{
	@observable run = false;
	@observable type: string = '';
	@observable options?: TCanvasConfettiAnimationOptions;
	@observable text: string = '';

	constructor()
	{
		makeObservable(this);
	}

	@action
	shoot({preset, text, options}: ConfettiShoot)
	{
		this.type = preset || '';
		this.text = text || '';
		this.options = options;
		this.run = true;
		setTimeout(() => this.run = false, 5000);
	}
}

export const confetti = new ConfettiStore();
