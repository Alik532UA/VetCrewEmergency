import type { LibraryArticle } from './types';

export const nestling: LibraryArticle = {
	slug: 'nestling',
	group: 'birds',
	emoji: '🐣',
	title: {
		uk: '…ви знайшли пташеня?',
		en: '…you found a nestling?'
	},
	teaser: {
		uk: 'Коли його потрібно повернути в гніздо, а коли залишити в спокої.',
		en: 'When to put it back in the nest, and when to leave it alone.'
	},
	answer: {
		uk: 'Спершу подивіться, чи є на пташеняті пір’я: оперене пташеня на землі — це нормально, голе — ні.',
		en: 'First check for feathers: a feathered fledgling on the ground is normal, a naked chick is not.'
	},
	blocks: {
		intervene: {
			uk: 'Здебільшого ні. Слітки — пташенята, які вже вийшли з гнізда, але ще не літають, — проводять на землі кілька днів, і батьки їх годують.',
			en: 'Mostly no. Fledglings that have left the nest but cannot yet fly spend a few days on the ground, and their parents feed them.'
		},
		whenHelp: {
			uk: 'Якщо пташеня голе або в пуху й випало з гнізда, якщо воно поранене, якщо гніздо зруйноване або якщо поряд кіт і відвести його неможливо.',
			en: 'If the chick is naked or downy and has fallen from the nest, if it is injured, if the nest is destroyed, or a cat is nearby and cannot be kept away.'
		},
		never: {
			uk: 'Не напувайте пташеня з піпетки — вода потрапляє в дихальні шляхи. Не годуйте хлібом, молоком і кашею. Не забирайте здорового слітка «під опіку».',
			en: 'Do not give water with a pipette — it gets into the airways. Do not feed bread, milk or porridge. Do not take a healthy fledgling “into care”.'
		},
		whenCall: {
			uk: 'Якщо гніздо недосяжне, якщо пташеня травмоване або якщо ви не розумієте, сліток це чи випале пташеня.',
			en: 'If the nest is out of reach, if the chick is injured, or if you cannot tell a fledgling from a fallen nestling.'
		}
	},
	story: {
		uk: 'Осоїд після обстрілу: знайдений контуженим на вулицях міста, після реабілітації повернувся у природу.',
		en: 'A honey buzzard after shelling: found concussed on city streets, returned to the wild after rehabilitation.'
	},
	related: ['owlet', 'swift', 'window-strike']
};
