import {BeautifulWords, Words} from '@/db/schemas.ts';
import {BeautifulWordsfile} from "@/interfaces/beautiful_wordsfile.ts";
import {mkdir, open, writeFile} from "node:fs/promises";

(async () =>
{
	try {
		const wordsDB = await Words.find({});

		let words: {[word: string]: number} = {};

		for (let {word} of wordsDB)
			words[word] = 1;

		await mkdir('autogen', {recursive: true});

		let words_file = `import {WordsFile} from '../interfaces/wordsfile';\n
export default ${JSON.stringify(words)} as WordsFile;`;
		await open('autogen/words.ts', 'w');
		await writeFile('autogen/words.ts', words_file);
		console.log('The words file has been generated successfully!');

		const beautifulWordsDB = await BeautifulWords.find({});

		let beautifulWords: BeautifulWordsfile = {};

		for (let word of beautifulWordsDB)
		{
			beautifulWords[word.word] = {
				message: word.message,
				customIcon: word.customIcon,
				confetti: word.confetti,
			};
		}

		let beautiful_words_file = `import {BeautifulWordsfile} from '../interfaces/beautiful_wordsfile';\n
export default ${JSON.stringify(beautifulWords)} as BeautifulWordsfile;`;
		await open('autogen/beautiful_words.ts', 'w');
		await writeFile('autogen/beautiful_words.ts', beautiful_words_file);
		console.log('The beautiful words file has been generated successfully!');

		process.exit();
	} catch (e)
	{
		console.log(e);
	}
})();
