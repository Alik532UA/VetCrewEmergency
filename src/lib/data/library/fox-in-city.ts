import type { LibraryArticle } from './types';

export const fox_in_city: LibraryArticle = {
	slug: 'fox-in-city',
	group: 'foxes',
	emoji: '🏙️',
	title: {
		uk: '…лисиця живе поруч із людьми?',
		en: '…a fox is living near people?'
	},
	teaser: {
		uk: 'Лисиці давно освоїли міста й околиці. Розберіться, коли це просто сусідство, а коли ознака біди.',
		en: 'Foxes have long settled in towns and their edges. Learn when this is mere neighbourhood and when it is a sign of trouble.'
	},
	answer: {
		uk: 'Лисиця в місті — не хвора за визначенням. Здорова тварина тримає дистанцію й виходить надвечір.',
		en: 'A fox in town is not ill by definition. A healthy animal keeps its distance and comes out towards evening.'
	},
	blocks: {
		intervene: {
			uk: 'Ні. Лисицю, яка просто проходить подвір’ям, ловити чи проганяти не треба.',
			en: 'No. A fox merely crossing a yard does not need catching or chasing.'
		},
		whenHelp: {
			uk: 'Якщо вона не тікає, хитається, має залисини на хутрі або виходить серед дня й іде до людей.',
			en: 'If it does not flee, staggers, has bald patches, or comes out in daylight and walks up to people.'
		},
		never: {
			uk: 'Не підгодовуйте. Лисиця, яка чекає на їжу від людей, гине першою — від машин, собак і рушниці.',
			en: 'Do not feed it. A fox that waits for food from people is the first to die — to cars, dogs and guns.'
		},
		whenCall: {
			uk: 'Якщо бачите ознаки хвороби або тварина оселилася там, де їй загрожує небезпека.',
			en: 'If you see signs of illness, or the animal has settled where it is in danger.'
		}
	},
	story: {
		uk: 'Лисиця, що кілька тижнів приходила по недоїдки: історія скінчилася добре лише тому, що підгодовування припинили вчасно.',
		en: 'A fox that came for scraps for weeks: it ended well only because the feeding stopped in time.'
	},
	related: ['fox-mange', 'fox-kit', 'mustelids-near-us']
};
