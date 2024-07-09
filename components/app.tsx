/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {Keyboard} from "@/components/keyboard.tsx";
import {observer} from "mobx-react-lite";
import {Dialog} from "@/components/dialog.tsx";
import {useEffect, useRef, useState} from "react";
import {Rules} from "@/components/dialogs/rules.tsx";
import {SummaryDialog} from "@/components/dialogs/summary.tsx";
import {Confetti} from "@/components/confetti.tsx";
import {Game} from "@/components/game.tsx";
import {game} from "@/stores/game.store.ts";
import {GameStatus} from "@/interfaces/game_status.ts";
import {dialog} from "@/stores/dialog.store.ts";

const styleApp = css`
	display: flex;
	flex-direction: column;
	max-width: 500px;
	height: 100vh;
	
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 50px;
		color: #1a1a1b;
		border-bottom: 1px solid #d3d6da;
		
		> .title {
			font-weight: 700;
			font-size: 36px;
			letter-spacing: 0.2rem;
			text-transform: uppercase;
			text-align: center;
			position: absolute;
			left: 0;
			right: 0;
			pointer-events: none;
		}
	}
	
	.game-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-grow: 1;
		overflow: hidden;
	}
	
	.game {
		width: 350px;
		height: 420px;
		display: grid;
		grid-template-rows: repeat(6, 1fr);
		grid-gap: 5px;
		padding: 10px;
		box-sizing: border-box;
	}
`;
export const App = observer(() =>
{
	const [loading, setLoading] = useState(true);
	const appElement = useRef<HTMLDivElement>(null);

	useEffect(() =>
	{
		setLoading(false);
		const observer = new MutationObserver((mutations =>
		{
			for (const mutation of mutations)
			{
				const successRemoved = Array.from(mutation.removedNodes).some(node => (node as HTMLElement).classList.contains('notify--success'));
				const errorRemoved = Array.from(mutation.removedNodes).some(node => (node as HTMLElement).classList.contains('notify--error'));
				if (mutation.type === 'childList' && (successRemoved || errorRemoved))
				{
					dialog.open(SummaryDialog);
					observer.disconnect();
					break;
				}
			}
		}));

		observer.observe(document.body, {childList: true, subtree: true});
	}, []);

	useEffect(() =>
	{
		if (game.state?.gameStatus !== GameStatus.IN_PROGRESS)
			game.onFinish();
	}, [game.state?.gameStatus]);


	return !loading ? <div css={styleApp} className="container" ref={appElement}>
		<header>
			<button type="button" className="btn btn-light" onClick={() => dialog.open(Rules)}>
				<i className="fa fa-info"/>
			</button>
			<div className="title">מילהל</div>
			<button type="button" className="btn btn-light" onClick={() => dialog.open(SummaryDialog)}>
				<i className="fa fa-bar-chart"/>
			</button>
		</header>
		<Game/>
		<Keyboard/>
		<Dialog/>
		<Confetti/>
	</div> : null;
});
