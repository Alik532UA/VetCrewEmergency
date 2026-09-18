import rawBody from './bodies/ferret-escaped.json';
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

export const ferret_escaped: LibraryArticle = {
	slug: 'ferret-escaped',
	group: 'mustelids',
	emoji: '🏃',
	title: {
		uk: '…у вас утік свійський тхір?',
		en: '…your pet ferret has escaped?'
	},
	teaser: {
		uk: 'Де шукати, які сигнали спрацьовують і як перекрити шлях втечі, щоб це не повторилося.',
		en: 'Where to look, which signals work, and how to close the escape route so it does not happen again.'
	},
	answer: {
		uk: 'Шукайте поруч: тхори рідко йдуть далеко й ховаються у найвужчих щілинах біля дому.',
		en: 'Search close by: ferrets rarely go far and hide in the narrowest gaps around the house.'
	},
	blocks: {
		intervene: {
			uk: 'Так — це ваша тварина, і на вулиці вона не виживе.',
			en: 'Yes — this is your animal, and it will not survive outdoors.'
		},
		whenHelp: {
			uk: 'Одразу. Що більше часу минуло, то далі тхір може опинитися.',
			en: 'Straight away. The more time passes, the further the ferret can get.'
		},
		never: {
			uk: 'Не покладайтеся на те, що він «повернеться сам»: свійський тхір не має навичок виживання в природі.',
			en: 'Do not count on it “coming back by itself”: a pet ferret has no survival skills in the wild.'
		},
		whenCall: {
			uk: 'Якщо пошуки не дали результату — повідомте нас, щоб ми впізнали тварину, коли її знайдуть.',
			en: 'If the search brings nothing — tell us, so we recognise the animal when someone finds it.'
		}
	},
	body: asBody(rawBody),
	story: {
		uk: 'Свійський тхір, якого знайшли за два двори від дому — власника шукали через нашу лінію.',
		en: 'A pet ferret found two yards from home — the owner was traced through our line.'
	},
	related: ['ferret-found', 'mustelids-id', 'transport-mustelid']
};
