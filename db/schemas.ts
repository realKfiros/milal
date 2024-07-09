import '@/db/config.ts';
import mongoose from 'mongoose';

export const Words = mongoose.models.words ?? mongoose.model('words', new mongoose.Schema({
	word: String,
}));

export const Days = mongoose.models.days ?? mongoose.model('days', new mongoose.Schema({
	date: String,
	word_id: mongoose.Types.ObjectId,
}));

export const BeautifulWords = mongoose.models.beautiful_words ?? mongoose.model('beautiful_words', new mongoose.Schema({
	word: String,
	message: String,
	customIcon: String,
	confetti: {
		preset: String,
		options: {
			colors: Array,
		}
	},
}));
