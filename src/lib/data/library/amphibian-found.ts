import type { LibraryArticle } from './types';

export const amphibian_found: LibraryArticle = {
	slug: 'amphibian-found',
	group: 'reptiles',
	emoji: '🐸',
	title: {
		uk: '…ви знайшли жабу або тритона в небезпеці?',
		en: '…you found a frog or newt in danger?'
	},
	teaser: {
		uk: 'Земноводні гинуть у підвалах, басейнах і на дорогах під час міграції. Допомога тут майже завжди проста.',
		en: 'Amphibians die in cellars, pools and on roads during migration. Here help is almost always simple.'
	},
	answer: {
		uk: 'Дістаньте тварину з пастки й випустіть у вологому місці поруч — далеко нести не треба.',
		en: 'Lift the animal out of the trap and release it in a damp spot nearby — there is no need to carry it far.'
	},
	blocks: {
		intervene: {
			uk: 'Так, якщо вона в басейні, підвалі, водостоку чи на дорозі — тобто там, звідки не вибереться сама.',
			en: 'Yes, if it is in a pool, cellar, drain or on a road — somewhere it cannot leave by itself.'
		},
		whenHelp: {
			uk: 'Якщо тварина поранена, пересохла, або якщо їх десятки — під час весняної міграції це звичайна справа.',
			en: 'If the animal is injured or dried out, or if there are dozens of them — during the spring migration that is common.'
		},
		never: {
			uk: 'Не беріть сухими руками: суха шкіра людини пошкоджує їхню. Змочіть руки або скористайтеся вологим листком.',
			en: 'Do not use dry hands: dry human skin damages theirs. Wet your hands or use a damp leaf.'
		},
		whenCall: {
			uk: 'Якщо тварина травмована або ви натрапили на масову загибель на дорозі.',
			en: 'If the animal is injured, or you have come across a mass die-off on a road.'
		}
	},
	story: {
		uk: 'Жаби, що щовесни гинули на одній ділянці дороги: допомогли не руки, а тимчасовий бар’єр.',
		en: 'Frogs dying every spring on one stretch of road: what helped was not hands but a temporary barrier.'
	},
	related: ['turtle-road', 'snake-encounter', 'mustelids-near-us']
};
