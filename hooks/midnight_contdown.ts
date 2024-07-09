import {useState, useEffect} from 'react';

const calculateTimeUntilMidnight = (): string =>
{
	const now = new Date();
	const endOfDay = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		23, 59, 59
	);
	const difference = endOfDay.getTime() - now.getTime();

	let timeLeft = '00:00:00';

	if (difference > 0)
	{
		const hours = Math.floor(difference / (1000 * 60 * 60));
		const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((difference % (1000 * 60)) / 1000);
		timeLeft = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
	}

	return timeLeft;
};

export const useMidnightCountdown = (): string =>
{
	const [timeLeft, setTimeLeft] = useState<string>(calculateTimeUntilMidnight());

	useEffect(() =>
	{
		const timer = setInterval(() => setTimeLeft(calculateTimeUntilMidnight()), 1000);

		return () => clearInterval(timer);
	}, []);

	return timeLeft;
};
