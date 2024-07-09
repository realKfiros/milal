/** @jsxImportSource @emotion/react */

import {observer} from "mobx-react-lite";
import {css} from "@emotion/react";
import {FC, useEffect, useState} from "react";
import {game} from "../stores/game.store.ts";
import {AnimatePresence, motion, useAnimation} from "framer-motion";

interface CharStyleConstructorProps
{
	value?: string;
	color?: string;
}

interface TileProps
{
	value?: string;
	row: number;
	col: number;
	isFinal?: boolean;
}

const tileAnimations = {
	scale: {
		scale: [1, 1.05, 1],
		duration: .3,
	}
};

const styleChar = ({value, color}: CharStyleConstructorProps) => css`
	flex: 1;
	width: 100%;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	font-size: 2rem;
	line-height: 2rem;
	font-weight: bold;
	vertical-align: middle;
	box-sizing: border-box;
	color: ${color ? '#fff' : '#1a1a1b'};
	text-transform: uppercase;
	user-select: none;

	background-color: ${color ? color : '#fff'};
	border: 2px solid ${value ? '#1a1a1b' : '#d3d6da'};
`;
const Tile: FC<TileProps> = observer(({value, row, col, isFinal = false}) =>
{
	const [mounted, setMounted] = useState(false);
	const animation = useAnimation();

	useEffect(() =>
	{
		setMounted(true);
		return () => setMounted(false);
	}, []);

	useEffect(() =>
	{
		animation.start('scale');
	}, [value]);

	let color: string;
	if (isFinal)
		color = game.board?.[row]?.[col] === 'correct' ? '#6aaa64' :
			game.board?.[row]?.[col] === 'present' ? '#c9b458' :'#787c7e';

	return <AnimatePresence initial={false}>
		{mounted && <motion.div css={styleChar({value, color: color!})} animate={animation} variants={tileAnimations} transition={{bounce: 0}}>
			{value}
		</motion.div>}
	</AnimatePresence>;
});

interface RowProps
{
	index: number;
}

const rowAnimations = {
	hide: {
		rotateX: [0, 90],
		duration: .6,
	},
	show: {
		rotateX: [-90, 0],
		duration: .6,
	},
	shake: {
		rotate: [0, -1, 2, -4, 4, -4, 4, -4, 2, -1, 0],
		duration: .75,
	},
	reset: {
		rotate: 0,
	}
};

const styleRow = css`
	flex: 1;
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	grid-gap: 5px;
	direction: rtl;
`;
export const Row: FC<RowProps> = observer(({index}) =>
{
	const [mounted, setMounted] = useState(false);
	const animations = useAnimation();
	const {state, shake} = game;
	const [evaluation, setEvaluation] = useState(state?.evaluations?.[index]);

	useEffect(() =>
	{
		setMounted(true);
		return () => setMounted(false);
	}, []);

	useEffect(() =>
	{
		if (mounted)
		{
			animations.start('hide').then(() =>
			{
				setEvaluation(state?.evaluations?.[index] || "");
				animations.start('show');
			});
		}
	}, [state?.evaluations?.[index]]);

	useEffect(() =>
	{
		if (index === game.rowIndex && shake)
			animations.start('shake').then(() => animations.start('reset'));
	}, [index, game.rowIndex, shake]);

	const word = state?.boardStatus?.[index];

	return <AnimatePresence>
		{mounted && <motion.div css={styleRow} animate={animations} variants={rowAnimations} transition={{bounce: 0}}>
			{Array.from(Array(5).keys()).map((pos) => <Tile value={word?.[pos]} row={index} col={pos} key={index + ' ' + pos} isFinal={!!evaluation}/>)}
		</motion.div>}
	</AnimatePresence>;
});

interface ExampleRowProps
{
	word: string;
	exampleWord: string;
}

export const ExampleRow: FC<ExampleRowProps> = ({word, exampleWord}) =>
{
	return <div css={styleRow} style={{width: 350, height: 70, margin: '0 auto'}}>
		{Array.from(exampleWord).map((char, index) =>
		{
			if (word[index] === char)
				return <div css={styleChar({value: char, color: '#6aaa64'})} key={Math.random()}>
					{char}
				</div>;
			else if (word.includes(char))
				return <div css={styleChar({value: char, color: '#c9b458'})} key={Math.random()}>
					{char}
				</div>;
			else
				return <div css={styleChar({value: char, color: '#787c7e'})} key={Math.random()}>
					{char}
				</div>;
		})}
	</div>;
};
