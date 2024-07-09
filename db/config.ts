import * as dotenv from 'dotenv';
import {fileURLToPath} from "node:url";
import {dirname} from "node:path";
import mongoose from 'mongoose';

dotenv.config({path: dirname(fileURLToPath(import.meta.url)) + '/../.env.local'});

mongoose.connect(process.env.MONGO_URI || '', {
	dbName: 'milal'
});
