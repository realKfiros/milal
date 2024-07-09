import type {NextApiRequest, NextApiResponse} from "next";
import {Days, Words} from "@/db/schemas.ts";
import requestIp from 'request-ip';
import moment from "moment";

type Data = {
	name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>)
{
	// @ts-ignore
	if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`)
		return res.status(401).end('Unauthorized');

	return new Promise<void>(async (resolve, reject) =>
	{
		try
		{
			const today = await Days.exists({date: moment().add(1, 'd').format('YYYY-MM-DD')});
			if (!today)
			{
				const count = await Words.countDocuments();
				const random = Math.floor(Math.random() * count);
				const word = await Words.findOne().skip(random);
				await Days.create({word_id: word._id, date: moment().add(1, 'd').format('YYYY-MM-DD')});
			}
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
