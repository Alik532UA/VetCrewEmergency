import type { LibraryArticle } from './types';

export const snake_encounter: LibraryArticle = {
	slug: 'snake-encounter',
	group: 'reptiles',
	emoji: '🐍',
	title: {
		uk: '…ви зустріли змію?',
		en: '…you met a snake?'
	},
	teaser: {
		uk: 'Майже всі змії України не небезпечні для людини, а вужа плутають з гадюкою щодня. Головне правило — не чіпати.',
		en: 'Almost every snake in Ukraine is harmless to people, and grass snakes are mistaken for vipers daily. The rule is simple: do not touch.'
	},
	answer: {
		uk: 'Відійдіть і дайте їй піти. Змія не нападає першою — вона захищається, коли їй не лишили дороги.',
		en: 'Step back and let it leave. A snake does not attack first — it defends itself when left no way out.'
	},
	blocks: {
		intervene: {
			uk: 'Ні. Змію не треба ні ловити, ні проганяти, ні «переселяти».',
			en: 'No. A snake needs no catching, no chasing and no “relocating”.'
		},
		whenHelp: {
			uk: 'Якщо вона травмована, заплуталася в сітці від птахів чи в будівельній сітці, або опинилася в приміщенні й не може вийти.',
			en: 'If it is injured, tangled in bird netting or construction mesh, or trapped indoors with no way out.'
		},
		never: {
			uk: 'Не беріть у руки й не намагайтеся визначити вид зблизька. Не вбивайте: усі змії України під охороною.',
			en: 'Do not pick it up or try to identify it up close. Do not kill it: every snake in Ukraine is protected.'
		},
		whenCall: {
			uk: 'Якщо змія в приміщенні, заплуталася або травмована — і завжди, якщо стався укус.',
			en: 'If the snake is indoors, tangled or injured — and always if a bite has happened.'
		}
	},
	story: {
		uk: 'Вуж, що заплутався в сітці проти птахів: такі сітки ловлять значно більше, ніж на них розраховують.',
		en: 'A grass snake tangled in anti-bird netting: such nets catch far more than they are meant to.'
	},
	related: ['turtle-road', 'amphibian-found', 'mustelids-near-us']
};
