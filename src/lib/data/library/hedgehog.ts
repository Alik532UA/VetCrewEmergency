import type { LibraryArticle } from './types';

export const hedgehog: LibraryArticle = {
	slug: 'hedgehog',
	group: 'hedgehogs',
	emoji: '🦔',
	title: {
		uk: '…ви знайшли їжака?',
		en: '…you found a hedgehog?'
	},
	teaser: {
		uk: 'Коли він потребує допомоги, а коли це нормальна поведінка.',
		en: 'When it needs help, and when this is simply normal behaviour.'
	},
	answer: {
		uk: 'Їжак, який упевнено біжить уночі, допомоги не потребує. Тривожна ознака — їжак удень.',
		en: 'A hedgehog moving confidently at night needs no help. The warning sign is a hedgehog out in daylight.'
	},
	blocks: {
		intervene: {
			uk: 'Уночі — ні, це його звичайний час. Удень здоровий їжак зазвичай спить, тому денна поява на відкритому місці вимагає уваги.',
			en: 'At night, no — that is its normal time. In daylight a healthy hedgehog usually sleeps, so appearing in the open by day calls for attention.'
		},
		whenHelp: {
			uk: 'Якщо їжак лежить розпростертий, хитається, має рани, обліплений кліщами чи мухами, якщо він потрапив у сітку або яму, або якщо це малюк, який пищить і повзає сам.',
			en: 'If the hedgehog lies stretched out, staggers, has wounds, is covered in ticks or flies, is caught in netting or a pit, or is a squeaking youngster crawling alone.'
		},
		never: {
			uk: 'Не давайте молока — воно викликає тяжкий розлад. Не мийте їжака, не знімайте кліщів самостійно й не залишайте його вдома «на перезимівлю».',
			en: 'Do not give milk — it causes severe illness. Do not wash the hedgehog, do not pull ticks off yourself and do not keep it at home “for the winter”.'
		},
		whenCall: {
			uk: 'Якщо бачите будь-яку з ознак вище, і завжди — якщо їжака знайдено вдень на відкритому місці.',
			en: 'If you see any of the signs above, and always if a hedgehog is found in the open during the day.'
		}
	},
	story: {
		uk: 'Родина їжаків після ДТП: мама-їжачиха боролася за життя, а малюки чекали поруч. Зрештою вся родина повернулася у дику природу.',
		en: 'A hedgehog family after a road accident: the mother fought for her life while her young waited nearby. In the end the whole family returned to the wild.'
	},
	related: ['fawn', 'hare', 'bat']
};
