import {FC} from "react";

interface Button
{
	text: string;
	icon: string;
	onClick: () => void;
}

export interface DialogContent
{
	element: FC;
	title?: string;
	buttons?: Array<Button>;
}
