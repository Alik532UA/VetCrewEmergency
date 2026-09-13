import type { LibraryArticle } from './types';

export const window_strike: LibraryArticle = {
	slug: 'window-strike',
	emoji: '🪟',
	title: {
		uk: '…птах врізався у вікно?',
		en: '…a bird flew into a window?'
	},
	teaser: {
		uk: 'Чому птах, який «просто оговтується», часто має струс, і скільки чекати.',
		en: 'Why a bird that seems to be “just catching its breath” often has concussion, and how long to wait.'
	},
	answer: {
		uk: 'Накрийте птаха коробкою й дайте йому годину тиші й темряви — більшість приходить до тями саме так.',
		en: 'Cover the bird with a box and give it an hour of quiet darkness — most come round exactly this way.'
	},
	blocks: {
		intervene: {
			uk: 'Так, але мінімально: птаха треба прибрати з відкритого місця, де його дістане кіт або машина, і залишити в спокої.',
			en: 'Yes, but minimally: move the bird out of the open where a cat or a car will reach it, then leave it alone.'
		},
		whenHelp: {
			uk: 'Якщо через годину птах не злітає, якщо є кров, звисле крило, якщо голова нахилена набік або птах не тримає рівновагу.',
			en: 'If the bird cannot fly after an hour, if there is blood, a drooping wing, a head tilted to one side, or it cannot keep its balance.'
		},
		never: {
			uk: 'Не тримайте птаха в руках, не «приводьте до тями» водою й не випускайте його одразу — злетівши зі струсом, він вдариться вдруге.',
			en: 'Do not hold the bird in your hands, do not “revive” it with water and do not release it at once — taking off concussed, it will strike again.'
		},
		whenCall: {
			uk: 'Якщо минула година, а стан не змінився, або якщо ви одразу бачите травму.',
			en: 'If an hour has passed with no change, or if you can see an injury straight away.'
		}
	},
	story: {
		uk: 'Осоїд після обстрілу: знайдений контуженим, повернувся у дику природу після реабілітації.',
		en: 'A honey buzzard after shelling: found concussed, returned to the wild after rehabilitation.'
	},
	related: ['nestling', 'swift', 'owlet']
};
