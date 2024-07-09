import type {NextApiRequest, NextApiResponse} from "next";
import {Days, Words} from "@/db/schemas.ts";
import moment from "moment";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>)
{
	try
	{
		const today = await Days.findOne({date: moment().format('YYYY-MM-DD')});
		const word = await Words.findById(today.word_id);
		res.status(200).json(word.word);
	}
	catch (err)
	{
		console.log(err);
		res.status(500).send('Error');
	}
}
