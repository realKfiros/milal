/** @jsxImportSource @emotion/react */
import {Row} from "./row";
import {css} from "@emotion/react";

const styleGame = css`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-grow: 1;
	overflow: hidden;

	.game-board {
		width: 350px;
		height: 420px;
		display: grid;
		grid-template-rows: repeat(6, 1fr);
		grid-gap: 5px;
		padding: 10px;
		box-sizing: border-box;
	}
`;
export const Game = () =>
{
	return <div css={styleGame}>
		<div className="game-board">
			{Array.from(Array(6).keys()).map((index) => <Row index={index} key={index} />)}
		</div>
	</div>;
};
