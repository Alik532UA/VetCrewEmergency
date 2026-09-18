import rawBody from './bodies/mustelids-id.json';
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

export const mustelids_id: LibraryArticle = {
	slug: 'mustelids-id',
	group: 'mustelids',
	emoji: '🦦',
	title: {
		uk: '…ви не знаєте, кого зустріли: куниця, ласка чи тхір?',
		en: '…you are not sure what you met: a marten, a weasel or a polecat?'
	},
	teaser: {
		uk: 'Куницевих України плутають постійно. Розберіться, хто є хто, — від цього залежить, чи потрібна тварині допомога.',
		en: 'Ukraine’s mustelids are confused constantly. Work out who is who — whether the animal needs help depends on it.'
	},
	answer: {
		uk: 'Спершу визначте вид: дика куниця біля людей — це норма, а домашній тхір на вулиці — тварина, що потребує допомоги.',
		en: 'Identify the species first: a wild marten near people is normal, while a pet ferret outdoors is an animal in need.'
	},
	blocks: {
		intervene: {
			uk: 'Ні, доки ви не впевнені, кого бачите. Дику куницю, ласку чи перегузню ловити не треба лише тому, що вона з’явилася поруч.',
			en: 'No, not until you are sure what you are looking at. A wild marten, weasel or polecat needs no catching simply for turning up nearby.'
		},
		whenHelp: {
			uk: 'Якщо тварина не тікає, дається в руки, виглядає виснаженою або має нетипове для дикого виду забарвлення — це може бути свійський тхір.',
			en: 'If the animal does not flee, lets you handle it, looks exhausted, or has a colouring unusual for a wild species — it may be a pet ferret.'
		},
		never: {
			uk: 'Не ловіть і не годуйте тварину, поки не зрозуміли, хто перед вами. Помилка у визначенні виду веде до неправильної допомоги.',
			en: 'Do not catch or feed the animal before you know who it is. A mistake in the species leads to the wrong kind of help.'
		},
		whenCall: {
			uk: 'Щойно виникає сумнів. Зробіть кілька фото з безпечної відстані — фахівці визначать вид швидше за будь-який опис.',
			en: 'The moment you have any doubt. Take a few photos from a safe distance — specialists identify a species faster than any description.'
		}
	},
	body: asBody(rawBody),
	story: {
		uk: 'Куниця, що заплуталася в антидроновій сітці на фронті: спершу її теж прийняли за свійського тхора.',
		en: 'A marten tangled in anti-drone netting at the front: at first it, too, was taken for a pet ferret.'
	},
	related: ['marten-kit', 'marten-in-city', 'ferret-found']
};
