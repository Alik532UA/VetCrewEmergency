import type { LibraryArticle } from './types';

export const bat: LibraryArticle = {
	slug: 'bat',
	emoji: '🦇',
	title: {
		uk: '…ви знайшли кажана?',
		en: '…you found a bat?'
	},
	teaser: {
		uk: 'Як безпечно діяти та чого не робити.',
		en: 'How to act safely, and what not to do.'
	},
	answer: {
		uk: 'Кажана не можна брати голими руками — ні здорового, ні знесиленого. Усе інше залежить від пори року.',
		en: 'Never handle a bat with bare hands — healthy or exhausted. Everything else depends on the season.'
	},
	blocks: {
		intervene: {
			uk: 'Лише якщо кажан опинився там, де не може лишатися: у кімнаті, на підлозі, на тротуарі, на видноті вдень.',
			en: 'Only if the bat ended up where it cannot stay: indoors, on the floor, on a pavement, out in the open by day.'
		},
		whenHelp: {
			uk: 'Якщо кажан лежить на землі й не рухається, має пошкоджені крила, якщо його знайшли взимку в теплому приміщенні або якщо в помешканні опинилося кілька особин одразу.',
			en: 'If the bat lies still on the ground, has damaged wings, was found indoors in winter, or several individuals appear in a home at once.'
		},
		never: {
			uk: 'Не беріть кажана голими руками й не дозволяйте цього дітям. Не напувайте й не годуйте його, не випускайте взимку на мороз і не тримайте в банці без повітря.',
			en: 'Do not pick a bat up with bare hands and do not let children do it. Do not water or feed it, do not release it into winter cold and do not keep it in a sealed jar.'
		},
		whenCall: {
			uk: 'Одразу після того, як накрили кажана коробкою. Окремо повідомте, якщо був контакт зі шкірою — це важливо для вашої ж безпеки.',
			en: 'As soon as you have covered the bat with a box. Mention separately if there was skin contact — that matters for your own safety.'
		}
	},
	story: {
		uk: 'Мавпа з пляжу, яку експлуатували для фото з туристами, після порятунку вперше отримала шанс жити так, як має жити дика тварина.',
		en: 'A monkey from the beach, exploited for photos with tourists, got its first chance to live as a wild animal should.'
	},
	related: ['window-strike', 'fawn', 'hare']
};
