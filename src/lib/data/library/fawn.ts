import type { LibraryArticle } from './types';

export const fawn: LibraryArticle = {
	slug: 'fawn',
	emoji: '🦌',
	title: {
		uk: '…ви знайшли оленятко, козуленя чи лосеня?',
		en: '…you found a fawn or a moose calf?'
	},
	teaser: {
		uk: 'У більшості випадків найкраща допомога — не втручатися. Дізнайтеся, коли дитинча справді потребує допомоги.',
		en: 'In most cases the best help is no help at all. Learn when a fawn really needs assistance.'
	},
	answer: {
		uk: 'У більшості випадків оленятко не потребує допомоги. Не поспішайте забирати його — найімовірніше, мама знаходиться поруч.',
		en: 'In most cases a fawn needs no help. Do not rush to pick it up — the mother is most likely nearby.'
	},
	blocks: {
		intervene: {
			uk: 'Ні. Самка часто залишає маля саме на кілька годин, поки шукає їжу, але регулярно повертається до нього.',
			en: 'No. The doe often leaves the calf alone for hours while she feeds, and returns to it regularly.'
		},
		whenHelp: {
			uk: 'Якщо оленятко має явні травми, знаходиться біля дороги, потрапило в пастку, поряд немає матері тривалий час або йому загрожує небезпека.',
			en: 'If the fawn has visible injuries, is next to a road, is trapped, has been without its mother for a long time, or is in danger.'
		},
		never: {
			uk: 'Не забирайте оленятко додому, не годуйте його та не намагайтеся самостійно виховувати. Це може нашкодити його здоров’ю та зменшити шанси на повернення у природу.',
			en: 'Do not take the fawn home, do not feed it and do not try to raise it yourself. That harms its health and cuts its chances of returning to the wild.'
		},
		whenCall: {
			uk: 'Якщо ви не впевнені, чи потрібна допомога, або бачите ознаки травми чи небезпеки — зв’яжіться з нами. Ми допоможемо оцінити ситуацію та підкажемо, що робити далі.',
			en: 'If you are not sure whether help is needed, or you see signs of injury or danger, contact us. We will help assess the situation and tell you what to do next.'
		}
	},
	story: {
		uk: 'Історія козулят, евакуйованих із зони бойових дій, які сьогодні живуть у нашому Центрі довічної опіки.',
		en: 'The story of roe deer calves evacuated from a combat zone, who now live in our lifetime care centre.'
	},
	related: ['hare', 'hedgehog', 'bat']
};
