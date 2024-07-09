import {makeObservable, observable, action} from "mobx";
import {type DialogContent} from "@/interfaces/dialog_content.ts";
import {type FC} from "react";

class DialogStore
{
	@observable opened = false;
	@observable title?: string;
	@observable content?: FC;

	constructor()
	{
		makeObservable(this);
	}

	@action.bound
	open(content: DialogContent)
	{
		this.title = content.title || '';
		this.content = content.element;
		this.opened = true;
	}

	@action.bound
	closeDialog()
	{
		this.title = undefined;
		this.content = undefined;
		this.opened = false;
	}
}

export const dialog = new DialogStore();
