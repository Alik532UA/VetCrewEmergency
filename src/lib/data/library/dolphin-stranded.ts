import type { LibraryArticle } from './types';

export const dolphin_stranded: LibraryArticle = {
	slug: 'dolphin-stranded',
	group: 'marine',
	emoji: '🐬',
	title: {
		uk: '…дельфін опинився на березі?',
		en: '…a dolphin has stranded on the shore?'
	},
	teaser: {
		uk: 'Дельфін на березі — завжди надзвичайна ситуація. Від перших хвилин залежить майже все.',
		en: 'A stranded dolphin is always an emergency. Almost everything depends on the first minutes.'
	},
	answer: {
		uk: 'Телефонуйте одразу й не намагайтеся зіштовхнути його у воду: так гине більше дельфінів, ніж рятується.',
		en: 'Call at once and do not push it back into the water: that kills more dolphins than it saves.'
	},
	blocks: {
		intervene: {
			uk: 'Лише тримати тварину вологою й затіненою до приїзду фахівців — більше нічого.',
			en: 'Only keep the animal wet and shaded until specialists arrive — nothing more.'
		},
		whenHelp: {
			uk: 'Завжди. Здоровий дельфін на берег не виходить: якщо він там, щось уже сталося.',
			en: 'Always. A healthy dolphin does not come ashore: if it is there, something has already happened.'
		},
		never: {
			uk: 'Не тягніть за плавці й хвіст, не заливайте воду в дихало, не штовхайте назад у море, не збирайте натовп.',
			en: 'Do not pull the fins or tail, do not pour water into the blowhole, do not push it back out to sea, do not gather a crowd.'
		},
		whenCall: {
			uk: 'Негайно. Повідомте точне місце, розмір тварини й чи вона дихає.',
			en: 'Immediately. Report the exact location, the animal’s size and whether it is breathing.'
		}
	},
	story: {
		uk: 'Дельфін, якого знайшли на світанку: вчасний дзвінок дав фахівцям кілька годин, і цього вистачило.',
		en: 'A dolphin found at dawn: a timely call gave the specialists a few hours, and that was enough.'
	},
	related: ['oiled-bird', 'transport-mustelid', 'mustelids-near-us']
};
