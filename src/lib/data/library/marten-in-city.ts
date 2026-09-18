import rawBody from './bodies/marten-in-city.json';
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

export const marten_in_city: LibraryArticle = {
	slug: 'marten-in-city',
	group: 'mustelids',
	emoji: '🏙️',
	title: {
		uk: '…ви зустріли куницю в місті?',
		en: '…you met a marten in the city?'
	},
	teaser: {
		uk: 'Чому куниці з’являються в містах, як поводитися під час зустрічі та коли втручання справді потрібне.',
		en: 'Why martens appear in cities, how to behave during an encounter, and when intervention is really needed.'
	},
	answer: {
		uk: 'Куниця в місті — найчастіше молода тварина, яка шукає власну ділянку. Їй не потрібна допомога.',
		en: 'A marten in the city is most often a young animal looking for its own patch. It needs no help.'
	},
	blocks: {
		intervene: {
			uk: 'Ні, якщо тварина рухається впевнено, реагує на вас і тікає. Знімати її з дерева не треба.',
			en: 'No, if the animal moves confidently, reacts to you and runs away. There is no need to take it down from a tree.'
		},
		whenHelp: {
			uk: 'Якщо куниця кульгає, не тікає, лежить на відкритому місці або поводиться дезорієнтовано.',
			en: 'If the marten limps, does not flee, lies in the open, or behaves as though disoriented.'
		},
		never: {
			uk: 'Не ловіть, не заганяйте в кут і не намагайтеся «допомогти» руками: налякана куниця захищається.',
			en: 'Do not catch it, do not corner it and do not try to “help” with your hands: a frightened marten defends itself.'
		},
		whenCall: {
			uk: 'Якщо бачите ознаки травми або тварина не зникає протягом доби.',
			en: 'If you see signs of injury, or the animal does not leave within a day.'
		}
	},
	body: asBody(rawBody),
	story: {
		uk: 'Молода куниця, яку кілька вечорів поспіль бачили в дворі: допомоги вона не потребувала.',
		en: 'A young marten seen in a yard several evenings running: it needed no help at all.'
	},
	related: ['mustelids-near-us', 'mustelids-id', 'transport-mustelid']
};
