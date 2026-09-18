import type { LibraryArticle } from './types';

export const hedgehog_winter: LibraryArticle = {
	slug: 'hedgehog-winter',
	group: 'hedgehogs',
	emoji: '❄️',
	title: {
		uk: '…ви побачили їжака взимку?',
		en: '…you saw a hedgehog in winter?'
	},
	teaser: {
		uk: 'Узимку їжак має спати. Той, що ходить по снігу вдень, майже завжди потребує допомоги.',
		en: 'In winter a hedgehog should be asleep. One walking on snow in daylight almost always needs help.'
	},
	answer: {
		uk: 'Їжак, що активний узимку вдень, — це не «прокинувся погуляти». Це тварина в біді.',
		en: 'A hedgehog active in daylight in winter is not “out for a stroll”. It is an animal in trouble.'
	},
	blocks: {
		intervene: {
			uk: 'Так. Обережно накрийте коробкою або загорніть у тканину й перенесіть у прохолодне приміщення.',
			en: 'Yes. Gently cover it with a box or wrap it in cloth and move it to a cool room.'
		},
		whenHelp: {
			uk: 'Якщо їжак ходить удень, лежить розпластаний, хитається або якщо надворі вже мінус.',
			en: 'If it walks in daylight, lies flat and splayed, staggers, or if it is already below freezing outside.'
		},
		never: {
			uk: 'Не годуйте молоком і не кладіть до батареї: різке тепло для сплячої тварини небезпечніше за холод.',
			en: 'Do not feed it milk or put it by a radiator: sudden heat is more dangerous to a hibernating animal than cold.'
		},
		whenCall: {
			uk: 'Одразу. Взимку час рахується на години, а не на дні.',
			en: 'At once. In winter the clock runs in hours, not days.'
		}
	},
	story: {
		uk: 'Їжак, знайдений у грудні на снігу: за правильної допомоги він дожив до весни.',
		en: 'A hedgehog found on snow in December: with the right help it lived to spring.'
	},
	related: ['hedgehog', 'why-not-take-kits', 'transport-mustelid']
};
