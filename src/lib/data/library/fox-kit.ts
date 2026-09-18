import type { LibraryArticle } from './types';

export const fox_kit: LibraryArticle = {
	slug: 'fox-kit',
	group: 'foxes',
	emoji: '🦊',
	title: {
		uk: '…ви знайшли лисеня?',
		en: '…you found a fox cub?'
	},
	teaser: {
		uk: 'Лисенята виходять з нори задовго до того, як почнуть жити самостійно. Самі по собі вони — не привід забирати.',
		en: 'Fox cubs leave the den long before they live on their own. A cub alone is not a reason to take it.'
	},
	answer: {
		uk: 'Лисеня надворі саме — це норма: батьки поруч і приносять їжу кілька разів на добу.',
		en: 'A cub outside alone is normal: the parents are nearby and bring food several times a day.'
	},
	blocks: {
		intervene: {
			uk: 'Ні, якщо лисеня рухається, реагує на вас і не має видимих ран.',
			en: 'No, if the cub moves, reacts to you and has no visible wounds.'
		},
		whenHelp: {
			uk: 'Якщо воно холодне, мляве, обліплене мухами, якщо поруч загинула самка або якщо його принесли собаки.',
			en: 'If it is cold, limp or fly-blown, if the mother is dead nearby, or if dogs brought it in.'
		},
		never: {
			uk: 'Не годуйте молоком і не беріть додому «на день». Лисиця, вирощена людиною, боїться її менше, ніж треба, щоб вижити.',
			en: 'Do not feed it milk or take it home “for a day”. A hand-raised fox fears people less than it must to survive.'
		},
		whenCall: {
			uk: 'Якщо є будь-яка з ознак вище або лисеня лишається на тому самому місці добу.',
			en: 'If any sign above is present, or the cub stays in the same spot for a whole day.'
		}
	},
	story: {
		uk: 'Лисенята, яких «врятували» здоровими: повернути їх у природу вже не вдалося.',
		en: 'Cubs “rescued” while healthy: returning them to the wild was no longer possible.'
	},
	related: ['why-not-take-kits', 'fox-in-city', 'mustelids-near-us']
};
