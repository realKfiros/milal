import React from 'react';
import {App} from '@/components/app.tsx';
// import './index.css';
import 'bootstrap/dist/css/bootstrap.rtl.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'font-awesome/css/font-awesome.min.css';
import 'simple-notify/dist/simple-notify.css';
import {configure} from "mobx";
import axios from 'axios';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title} from 'chart.js';
import {Observer} from "mobx-react-lite";
import {Spinner} from "@/components/spinner.tsx";
import {game} from "@/stores/game.store.ts";
import {stats} from "@/stores/stats.store.ts";

configure({
	useProxies: "never",
	enforceActions: "observed",
});

axios.defaults.baseURL = 'api/';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title
);

export default function Main()
{
	return <React.StrictMode>
		<Observer>{() => game.state && stats.data ? <App /> : <Spinner />}</Observer>
	</React.StrictMode>
}
