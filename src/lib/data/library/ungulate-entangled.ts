import type { LibraryArticle } from './types';

export const ungulate_entangled: LibraryArticle = {
	slug: 'ungulate-entangled',
	group: 'ungulates',
	emoji: '🪢',
	title: {
		uk: '…копитне заплуталося в сітці чи паркані?',
		en: '…an ungulate is tangled in netting or a fence?'
	},
	teaser: {
		uk: 'Козуля чи олень у сітці — випадок, де кожна хвилина боротьби додає травм. Але звільняти самотужки небезпечно.',
		en: 'A roe deer or deer in netting is a case where every minute of struggle adds injuries. Yet freeing it yourself is dangerous.'
	},
	answer: {
		uk: 'Не підходьте й не ріжте сітку самі: тварина б’ється, а копита й роги травмують людину за секунду.',
		en: 'Do not approach or cut the netting yourself: the animal thrashes, and hooves and antlers injure a person in a second.'
	},
	blocks: {
		intervene: {
			uk: 'Лише відігнати собак, прибрати людей і чекати на фахівців із безпечної відстані.',
			en: 'Only drive off dogs, move people away, and wait for specialists at a safe distance.'
		},
		whenHelp: {
			uk: 'Завжди: тварина, що заплуталася, гине від виснаження й перегріву швидше, ніж від самої сітки.',
			en: 'Always: a tangled animal dies of exhaustion and overheating faster than of the netting itself.'
		},
		never: {
			uk: 'Не намагайтеся тримати, не накидайте мотузку, не давайте воду насильно, не збирайте глядачів.',
			en: 'Do not try to hold it, do not throw a rope on it, do not force water on it, do not gather onlookers.'
		},
		whenCall: {
			uk: 'Негайно. Назвіть точне місце й вид тварини — від цього залежить, хто виїде.',
			en: 'Immediately. Give the exact location and the species — that decides who is sent.'
		}
	},
	story: {
		uk: 'Козуля в антидроновій сітці: звільнити її вдалося, бо ніхто не почав різати сітку до приїзду фахівців.',
		en: 'A roe deer in anti-drone netting: it was freed because nobody started cutting before the specialists arrived.'
	},
	related: ['fawn', 'transport-mustelid', 'mustelids-near-us']
};
