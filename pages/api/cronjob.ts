import type {NextApiRequest, NextApiResponse} from "next";
import {Days, Words} from "@/db/schemas.ts";
import requestIp from 'request-ip';
import moment from "moment";

type Data = {
	name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>)
{
	return new Promise<void>(async (resolve, reject) =>
	{
		try
		{
			if (req.method !== 'POST')
			{
				res.status(401).end();
				resolve();
			}

			const ip = requestIp.getClientIp(req);

			if (!(process.env.IP_WHITELIST || '').split(',').includes(ip))
			{
				res.status(401).end();
				resolve();
			}

			const today = await Days.exists({date: moment().format('YYYY-MM-DD')});
			if (!today)
			{
				const count = await Words.countDocuments();
				const random = Math.floor(Math.random() * count);
				const word = await Words.findOne().skip(random);
				await Days.create({word_id: word._id, date: moment().format('YYYY-MM-DD')});
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
