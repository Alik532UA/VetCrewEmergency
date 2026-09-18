import rawBody from './bodies/mustelids-near-us.json';
import { asBody } from './types';
import type { LibraryArticle } from './types';

/**
 * ТИМЧАСОВО ОДНОМОВНА: поле `en` повторює українське.
 *
 * Матеріал надійшов лише українською, і сайт показують замовникові як прев'ю —
 * англійські сторінки віддають українською текст. Це видно, і так і задумано: краще
 * показати матеріал, ніж порожню сторінку. Тип вимагає обох мов, тому копія тут, а
 * не `undefined`; коли надійде переклад, міняти доведеться лише праву половину.
 */

export const mustelids_near_us: LibraryArticle = {
	slug: 'mustelids-near-us',
	group: 'mustelids',
	emoji: '🏘️',
	title: {
		uk: '…дикі тварини з’явилися біля вашої домівки?',
		en: '…wild animals have turned up near your home?'
	},
	teaser: {
		uk: 'Чому куницеві живуть поруч із людьми та як бути добрими сусідами, не перетворюючи зустріч на конфлікт.',
		en: 'Why mustelids live alongside people, and how to be good neighbours without turning an encounter into a conflict.'
	},
	answer: {
		uk: 'Поява дикої тварини поруч із домом — не надзвичайна подія: вона пристосовується до світу, який ми змінили.',
		en: 'A wild animal near a house is not an emergency: it is adapting to a world we have changed.'
	},
	blocks: {
		intervene: {
			uk: 'Ні, якщо тварина просто проходить повз. Сусідство саме собою не є проблемою й минає без втручання.',
			en: 'No, if the animal is simply passing by. Neighbourhood in itself is not a problem and passes without intervention.'
		},
		whenHelp: {
			uk: 'Якщо тварина травмована, знесилена, не тікає або оселилася там, де їй загрожує небезпека.',
			en: 'If the animal is injured, exhausted, does not flee, or has settled somewhere that puts it in danger.'
		},
		never: {
			uk: 'Не підгодовуйте й не привчайте до себе: тварина, яка перестала боятися людини, гине першою.',
			en: 'Do not feed it and do not let it get used to you: an animal that has stopped fearing people is the first to die.'
		},
		whenCall: {
			uk: 'Якщо сусідство перетворилося на конфлікт або ви бачите ознаки хвороби чи травми.',
			en: 'If the neighbourhood has turned into a conflict, or you see signs of illness or injury.'
		}
	},
	body: asBody(rawBody),
	story: {
		uk: 'Куниця, що оселилася на горищі: конфлікт вдалося розв’язати без жодної травми для тварини.',
		en: 'A marten that settled in an attic: the conflict was resolved without a single injury to the animal.'
	},
	related: ['marten-in-city', 'why-not-take-kits', 'mustelids-id']
};
