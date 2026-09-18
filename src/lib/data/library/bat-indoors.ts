import type { LibraryArticle } from './types';

export const bat_indoors: LibraryArticle = {
	slug: 'bat-indoors',
	group: 'bats',
	emoji: '🏠',
	title: {
		uk: '…кажан залетів у приміщення?',
		en: '…a bat has flown indoors?'
	},
	teaser: {
		uk: 'Найчастіше кажану потрібен лише відчинений шлях назовні. Але не голими руками — і не завжди просто випустити.',
		en: 'Most often a bat needs only an open way out. But never bare-handed — and letting it go is not always right.'
	},
	answer: {
		uk: 'Погасіть світло, відчиніть вікно й дайте йому вийти самому. Руками — лише в рукавичках.',
		en: 'Turn off the light, open a window and let it leave by itself. Hands only in gloves.'
	},
	blocks: {
		intervene: {
			uk: 'Ні, якщо кажан літає й може вийти сам. Так, якщо він сидить на підлозі чи на стіні внизу.',
			en: 'No, if the bat is flying and can leave by itself. Yes, if it sits on the floor or low on a wall.'
		},
		whenHelp: {
			uk: 'Якщо кажан не літає, лежить на підлозі, має пошкоджене крило або якщо надворі мороз.',
			en: 'If it cannot fly, lies on the floor, has a damaged wing, or if it is freezing outside.'
		},
		never: {
			uk: 'Не беріть голими руками, не давайте воду з піпетки, не випускайте взимку — узимку він має спати, а не летіти.',
			en: 'Do not handle it bare-handed, do not drip water into it, do not release it in winter — in winter it should be asleep, not flying.'
		},
		whenCall: {
			uk: 'Якщо кажан не може летіти, якщо їх кілька, або якщо був контакт зі шкірою людини чи тварини.',
			en: 'If it cannot fly, if there are several, or if there was contact with human or animal skin.'
		}
	},
	story: {
		uk: 'Кажани, що зимували на балконі: випустити їх у мороз означало б погубити всю групу.',
		en: 'Bats wintering on a balcony: releasing them into the frost would have killed the whole group.'
	},
	related: ['bat', 'mustelids-near-us', 'transport-mustelid']
};
