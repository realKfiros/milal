/** @jsxImportSource @emotion/react */

import KeyboardReact from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

import hebrew from "simple-keyboard-layouts/build/layouts/hebrew";

import {observer} from "mobx-react-lite";
import {css} from "@emotion/react";
import {game} from "../stores/game.store.ts";

const keyboardLayout = [
	"ק ר א ט ו ן ם פ",
	"ש ד ג כ ע י ח ל ך ף",
	"{backspace} ז ס ב ה נ מ צ ת ץ {enter}",
];

const buttonsDisplay = {
	"{backspace}": "⌫",
	"{enter}": "⏎",
};

const keyboardStyle = css`
	flex-grow: 1;
`;
export const Keyboard = observer(() =>
{
	return <div css={keyboardStyle}>
		<KeyboardReact
			{...hebrew}
			onKeyPress={async (b) =>
			{
				await game.write(b);
			}}
			layout={{default: keyboardLayout}}
			buttonTheme={game?.keyboardColors || []}
			display={buttonsDisplay}
			physicalKeyboardHighlightPress
			physicalKeyboardHighlight
			rtl
		/>
	</div>;
});
