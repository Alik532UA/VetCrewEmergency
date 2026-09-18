import type { LibraryArticle } from './types';

export const hare: LibraryArticle = {
	slug: 'hare',
	group: 'hares',
	emoji: '🐇',
	title: {
		uk: '…ви знайшли зайченя?',
		en: '…you found a leveret?'
	},
	teaser: {
		uk: 'Чому зайченя майже завжди не самотнє, навіть коли поруч нікого немає.',
		en: 'Why a leveret is almost never abandoned, even when nobody is in sight.'
	},
	answer: {
		uk: 'Зайченя, яке спокійно лежить у траві, не покинуте: зайчиха навідується до нього лише кілька разів на добу.',
		en: 'A leveret lying quietly in the grass is not abandoned: the hare visits it only a few times a day.'
	},
	blocks: {
		intervene: {
			uk: 'Ні. Зайченята з народження вкриті шерстю, бачать і здатні залягати самі — це їхній звичайний спосіб виживання.',
			en: 'No. Leverets are born furred, open-eyed and able to lie low on their own — that is their normal way of surviving.'
		},
		whenHelp: {
			uk: 'Якщо зайченя поранене, обліплене мухами, холодне й мляве, якщо поруч загинула зайчиха або воно опинилося на дорозі чи в скошеному полі.',
			en: 'If the leveret is injured, fly-blown, cold and limp, if the mother is dead nearby, or it ends up on a road or in a mown field.'
		},
		never: {
			uk: 'Не забирайте зайченя й не годуйте коров’ячим молоком — воно для нього непридатне. Не переносьте його «у безпечніше місце»: мати шукає маля там, де залишила.',
			en: 'Do not take the leveret and do not feed it cow’s milk — it is unsuitable. Do not move it “somewhere safer”: the mother looks for it where she left it.'
		},
		whenCall: {
			uk: 'Якщо бачите травму або будь-яку з ознак вище. Якщо просто сумніваєтесь — надішліть фото, не забираючи тварину.',
			en: 'If you see an injury or any of the signs above. If you are simply unsure, send a photo without taking the animal.'
		}
	},
	story: {
		uk: 'Козуля після ДТП отримала важкі травми, але після лікування та реабілітації повернулася у дику природу.',
		en: 'A roe deer hit by a car suffered severe injuries but returned to the wild after treatment and rehabilitation.'
	},
	related: ['fawn', 'hedgehog', 'bat']
};
