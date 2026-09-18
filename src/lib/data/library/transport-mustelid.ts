import rawBody from './bodies/transport-mustelid.json';
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

export const transport_mustelid: LibraryArticle = {
	slug: 'transport-mustelid',
	group: 'mustelids',
	emoji: '📦',
	title: {
		uk: '…вам потрібно перевезти куницевого до фахівців?',
		en: '…you need to take a mustelid to specialists?'
	},
	teaser: {
		uk: 'У чому перевозити, як тримати спокій у дорозі й чого не робити перед виїздом.',
		en: 'What to carry it in, how to keep it calm on the way, and what not to do before setting off.'
	},
	answer: {
		uk: 'Переносний контейнер, тиша й темрява — і якнайшвидше в дорогу. Не на руках і не в коробці.',
		en: 'A carrier, quiet and darkness — and on the road as fast as possible. Not in your arms, and not in a cardboard box.'
	},
	blocks: {
		intervene: {
			uk: 'Лише якщо транспортування справді потрібне — це вирішують фахівці, а не вигляд тварини.',
			en: 'Only if transport is really needed — specialists decide that, not how the animal looks.'
		},
		whenHelp: {
			uk: 'Коли фахівці підтвердили, що тварину треба доставити до клініки чи реабілітаційного центру.',
			en: 'When specialists have confirmed the animal must be taken to a clinic or a rehabilitation centre.'
		},
		never: {
			uk: 'Не везіть на руках, не годуйте й не напувайте перед дорогою без поради фахівців, не лишайте контейнер на сонці.',
			en: 'Do not carry it in your arms, do not feed or water it before the journey without advice, do not leave the carrier in the sun.'
		},
		whenCall: {
			uk: 'До виїзду. Ми підкажемо, куди саме везти й що підготувати.',
			en: 'Before you set off. We will say where exactly to take it and what to prepare.'
		}
	},
	body: asBody(rawBody),
	story: {
		uk: 'Куницю з антидроновою сіткою довезли вчасно — попереду була складна операція.',
		en: 'The marten with anti-drone netting arrived in time — a complex surgery lay ahead.'
	},
	related: ['marten-kit', 'marten-in-city', 'ferret-found']
};
