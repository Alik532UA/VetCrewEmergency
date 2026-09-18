import type { LibraryArticle } from './types';

export const leveret_mowing: LibraryArticle = {
	slug: 'leveret-mowing',
	group: 'hares',
	emoji: '🌾',
	title: {
		uk: '…ви знайшли зайченя під час косіння?',
		en: '…you found a leveret while mowing?'
	},
	teaser: {
		uk: 'Косовиця — найчастіша причина, з якої зайченята потрапляють до рук людей. Найкраще рішення тут не найочевидніше.',
		en: 'Mowing is the most common reason leverets end up in human hands. The best decision here is not the obvious one.'
	},
	answer: {
		uk: 'Якщо зайченя ціле — залиште його на місці й обійдіть ділянку. Мати повернеться вночі.',
		en: 'If the leveret is unhurt, leave it where it is and mow around the spot. The mother returns at night.'
	},
	blocks: {
		intervene: {
			uk: 'Ні, якщо воно неушкоджене. Зайченя від народження лежить саме — це не ознака біди.',
			en: 'No, if it is unhurt. A leveret lies alone from birth — that is not a sign of trouble.'
		},
		whenHelp: {
			uk: 'Якщо є порізи від ножів, кров, зламані кінцівки, або якщо мати загинула під час косіння.',
			en: 'If there are blade cuts, blood or broken limbs, or if the mother was killed by the mower.'
		},
		never: {
			uk: 'Не беріть у руки без потреби й не годуйте коров’ячим молоком: для зайченяти воно смертельне.',
			en: 'Do not pick it up needlessly and do not feed cow’s milk: for a leveret it is lethal.'
		},
		whenCall: {
			uk: 'Якщо є травми, якщо зайченя холодне, або якщо ви вже забрали його й не знаєте, що робити далі.',
			en: 'If there are injuries, if the leveret is cold, or if you have already taken it and do not know what to do next.'
		}
	},
	story: {
		uk: 'Зайченята, знайдені під косаркою: вижили ті, кого знайшли до, а не після.',
		en: 'Leverets found under a mower: the ones that lived were found before, not after.'
	},
	related: ['hare', 'why-not-take-kits', 'fawn']
};
