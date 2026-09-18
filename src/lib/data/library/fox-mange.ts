import type { LibraryArticle } from './types';

export const fox_mange: LibraryArticle = {
	slug: 'fox-mange',
	group: 'foxes',
	emoji: '🩹',
	title: {
		uk: '…лисиця виглядає хворою?',
		en: '…a fox looks ill?'
	},
	teaser: {
		uk: 'Залисини, виснаження, денна активність і байдужість до людей — ознаки, за яких тварині потрібна допомога.',
		en: 'Bald patches, exhaustion, daytime activity and indifference to people — the signs that an animal needs help.'
	},
	answer: {
		uk: 'Лисиця, яка не боїться людини, — не приручена. Найчастіше це хвора лисиця.',
		en: 'A fox that does not fear people is not tame. Most often it is a sick fox.'
	},
	blocks: {
		intervene: {
			uk: 'Не самотужки. Хвора лисиця — випадок для фахівців, а не для спроби зловити.',
			en: 'Not on your own. A sick fox is a case for specialists, not for an attempt to catch it.'
		},
		whenHelp: {
			uk: 'Залисини й струпи на хутрі, крайня худорба, хитка хода, судоми, слина, повна байдужість до людей і собак.',
			en: 'Bald patches and scabs, extreme thinness, an unsteady gait, seizures, drooling, complete indifference to people and dogs.'
		},
		never: {
			uk: 'Не торкайтеся голими руками, не пускайте до неї дітей і собак, не намагайтеся лікувати самотужки.',
			en: 'Do not touch it bare-handed, keep children and dogs away, and do not try to treat it yourself.'
		},
		whenCall: {
			uk: 'Одразу, щойно помітили ці ознаки. Опишіть поведінку й надішліть фото з безпечної відстані.',
			en: 'At once, as soon as you notice these signs. Describe the behaviour and send a photo from a safe distance.'
		}
	},
	story: {
		uk: 'Лисиця з важкою коростою, яку помітили в дворі: лікування тривало місяці.',
		en: 'A fox with severe mange spotted in a yard: the treatment took months.'
	},
	related: ['fox-in-city', 'fox-kit', 'transport-mustelid']
};
