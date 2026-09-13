import type { LibraryArticle } from './types';

export const owlet: LibraryArticle = {
	slug: 'owlet',
	emoji: '🦉',
	title: {
		uk: '…ви знайшли самотнє совеня?',
		en: '…you found a lone owlet?'
	},
	teaser: {
		uk: 'Не всі совенята на землі потребують порятунку. Дізнайтеся, коли потрібно втручатися, а коли краще залишити його в спокої.',
		en: 'Not every owlet on the ground needs rescuing. Learn when to step in and when to leave it be.'
	},
	answer: {
		uk: 'Совеня на землі чи на низькій гілці — нормальний етап дорослішання. Батьки годують його й там.',
		en: 'An owlet on the ground or a low branch is a normal stage of growing up. The parents feed it there too.'
	},
	blocks: {
		intervene: {
			uk: 'Ні. Совенята залишають гніздо раніше, ніж навчаються літати, і кілька днів проводять поряд із ним під наглядом батьків.',
			en: 'No. Owlets leave the nest before they can fly and spend several days near it under their parents’ watch.'
		},
		whenHelp: {
			uk: 'Якщо совеня лежить на боці, має видимі травми чи кров, якщо воно на проїжджій частині, у дворі з собаками, або якщо батьків не було поруч цілу ніч.',
			en: 'If the owlet lies on its side, has visible injuries or blood, is on a road or in a yard with dogs, or its parents were absent all night.'
		},
		never: {
			uk: 'Не забирайте совеня додому й не годуйте його м’ясом із магазину, молоком чи яйцем. Не тримайте його на світлі й не показуйте дітям — це сильний стрес.',
			en: 'Do not take the owlet home and do not feed it shop meat, milk or egg. Do not keep it in bright light or show it to children — that is severe stress.'
		},
		whenCall: {
			uk: 'Якщо бачите травму, якщо тварині загрожує небезпека просто зараз або якщо ви не можете визначити, доросла це птаха чи пташеня.',
			en: 'If you see an injury, if the bird is in immediate danger, or if you cannot tell an adult from a fledgling.'
		}
	},
	story: {
		uk: 'Сова зі зламаним крилом, врятована українськими військовими на фронті, після складного лікування повернулася у дику природу.',
		en: 'An owl with a broken wing, rescued by Ukrainian soldiers at the front, returned to the wild after complex treatment.'
	},
	related: ['nestling', 'swift', 'bat']
};
