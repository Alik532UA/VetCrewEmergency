import rawBody from './bodies/ferret-found.json';
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

export const ferret_found: LibraryArticle = {
	slug: 'ferret-found',
	group: 'mustelids',
	emoji: '🐾',
	title: {
		uk: '…ви знайшли свійського тхора на вулиці?',
		en: '…you found a pet ferret outdoors?'
	},
	teaser: {
		uk: 'Як відрізнити свійського тхора від дикої тварини, правильно діяти під час зустрічі й допомогти йому повернутися додому.',
		en: 'How to tell a pet ferret from a wild animal, what to do during the encounter, and how to help it get home.'
	},
	answer: {
		uk: 'Якщо це справді свійський тхір — його треба забрати: на відміну від дикої куниці, сам він не виживе.',
		en: 'If it really is a pet ferret, it must be picked up: unlike a wild marten, it will not survive on its own.'
	},
	blocks: {
		intervene: {
			uk: 'Так, якщо ви впевнені, що перед вами свійський тхір, і можете зробити це безпечно.',
			en: 'Yes, if you are sure it is a pet ferret and you can do it safely.'
		},
		whenHelp: {
			uk: 'Якщо тварина не тікає, дається в руки, виснажена або має забарвлення, нетипове для дикого виду.',
			en: 'If the animal does not flee, lets you handle it, is exhausted, or has a colouring unusual for a wild species.'
		},
		never: {
			uk: 'Не залишайте його на вулиці в надії, що він знайде дорогу додому. І не випускайте «на волю» — це не воля, а загибель.',
			en: 'Do not leave it outdoors hoping it will find its way home. And do not release it “to freedom” — that is not freedom but death.'
		},
		whenCall: {
			uk: 'Одразу, як тільки тварина в безпеці: ми допоможемо визначити вид і знайти власника.',
			en: 'As soon as the animal is safe: we will help identify the species and find the owner.'
		}
	},
	body: asBody(rawBody),
	story: {
		uk: 'Свійський тхір, якого знайшли на вулиці й повернули власникові через нашу лінію.',
		en: 'A pet ferret found on the street and returned to its owner through our line.'
	},
	related: ['ferret-escaped', 'mustelids-id', 'transport-mustelid']
};
