import type {NextApiRequest, NextApiResponse} from "next";
import {Days, Words} from "@/db/schemas.ts";
import moment from "moment";

type Data = {
	name: string;
};

const generateRandomWord = async (day: moment.Moment) =>
{
	const count = await Words.countDocuments();
	const random = Math.floor(Math.random() * count);
	const word = await Words.findOne().skip(random);
	await Days.create({word_id: word._id, date: day.format('YYYY-MM-DD')});
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>)
{
	if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`)
		return res.status(401).end();
	return new Promise<void>(async (resolve, reject) =>
	{
		try
		{
			const today = await Days.exists({date: moment().format('YYYY-MM-DD')});
			if (!today)
				await generateRandomWord(moment());
			const tomorrow = await Days.exists({date: moment().add(1, 'd').format('YYYY-MM-DD')});
			if (!tomorrow)
				await generateRandomWord(moment().add(1, 'd'));
			res.status(200).end();
			resolve();
		}
		catch (err)
		{
			console.log(err);
			res.status(500).end();
			resolve();
		}
	});
}
