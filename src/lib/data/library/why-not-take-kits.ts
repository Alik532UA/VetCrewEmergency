import rawBody from './bodies/why-not-take-kits.json';
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

export const why_not_take_kits: LibraryArticle = {
	slug: 'why-not-take-kits',
	group: 'mustelids',
	emoji: '🌿',
	title: {
		uk: '…ви думаєте забрати дитинча куницевих із природи?',
		en: '…you are thinking of taking a mustelid kit from the wild?'
	},
	teaser: {
		uk: 'Чому мати залишає малят самих, скільки часу може бути відсутньою та чому більшість «порятунків» насправді шкодять.',
		en: 'Why the mother leaves her kits alone, how long she can be away, and why most “rescues” do harm.'
	},
	answer: {
		uk: 'Здорове дитинча не покинуте: мати поруч і повернеться, щойно зникне небезпека — а небезпекою для неї є ви.',
		en: 'A healthy kit is not abandoned: the mother is nearby and returns as soon as the danger is gone — and the danger is you.'
	},
	blocks: {
		intervene: {
			uk: 'Ні. Самка залишає малят самих регулярно — поки шукає їжу або вчить їх досліджувати світ.',
			en: 'No. The female leaves her kits alone regularly — while she hunts or teaches them to explore the world.'
		},
		whenHelp: {
			uk: 'Якщо мати загинула, якщо на дитинчаті кров, рани чи личинки, якщо його принесли кіт або собака.',
			en: 'If the mother is dead, if there is blood, wounds or maggots on the kit, or if a cat or dog brought it in.'
		},
		never: {
			uk: 'Не забирайте здорове маля «про всяк випадок». Вигодувати — не означає підготувати до життя в природі: звикання до людини лишається назавжди.',
			en: 'Do not take a healthy kit “just in case”. Hand-rearing is not preparing for the wild: habituation to people stays for good.'
		},
		whenCall: {
			uk: 'Перш ніж забрати. Один дзвінок коштує менше, ніж дитинча, яке вже не зможе повернутися в природу.',
			en: 'Before you take it. One call costs less than a kit that can no longer return to the wild.'
		}
	},
	body: asBody(rawBody),
	story: {
		uk: 'Козенята, яких забрали «на порятунок» здоровими: повернути їх у природу вже не вдалося.',
		en: 'Fawns taken “to the rescue” while healthy: returning them to the wild was no longer possible.'
	},
	related: ['marten-kit', 'mustelids-id', 'mustelids-near-us']
};
