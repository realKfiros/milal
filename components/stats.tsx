import {Bar} from 'react-chartjs-2';
import {stats} from "../stores/stats.store.ts";

const options = {
	indexAxis: 'y',
	elements: {
		bar: {
			borderWidth: 2,
		},
	},
	scales: {
		x: {
			ticks: {
				stepSize: 1
			}
		}
	},
	tooltips: {enabled: false},
	hover: {mode: null},
	responsive: true,
	plugins: {
		title: {
			display: true,
			text: 'ניחושים',
		},
	},
};

export const Stats = () =>
{
	const data = {
		labels: Object.keys(stats.data!.guesses),
		datasets: [
			{
				label: 'ניחושים',
				data: Object.values(stats.data!.guesses),
			}
		]
	};

	return <div className="container">
		<div className="row">
			<div className="col">
				<div className="card-body">
					<div className="card-title">
						רצף
					</div>
					<div className="card-text">
						{stats.data?.currentStreak}
					</div>
				</div>
			</div>
			<div className="col-9">
				<div className="card-body">
					<div className="card-title">
						רצף ארוך ביותר
					</div>
					<div className="card-text">
						{stats.data?.maxStreak}
					</div>
				</div>
			</div>
		</div>
		<div className="row">
			<div className="col">
				<div className="card-body">
					<div className="card-title">
						הצלחה
					</div>
					<div className="card-text">
						{stats.winPercentage || 0}%
					</div>
				</div>
			</div>
			<div className="col">
				<div className="card-body">
					<div className="card-title">
						משחקים
					</div>
					<div className="card-text">
						{stats.data?.gamesPlayed}
					</div>
				</div>
			</div>
			<div className="col">
				<div className="card-body">
					<div className="card-title">
						ניצחונות
					</div>
					<div className="card-text">
						{stats.data?.gamesWon}
					</div>
				</div>
			</div>
			<div className="col">
				<div className="card-body">
					<div className="card-title">
						הפסדים
					</div>
					<div className="card-text">
						{stats.data?.gamesLost}
					</div>
				</div>
			</div>
		</div>
		<div className="row">
			<Bar options={options as object} data={data} />
		</div>
	</div>;
};
