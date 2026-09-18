import type { LibraryArticle } from './types';

export const oiled_bird: LibraryArticle = {
	slug: 'oiled-bird',
	group: 'marine',
	emoji: '🛢️',
	title: {
		uk: '…птах вимазаний у нафті чи мазуті?',
		en: '…a bird is covered in oil?'
	},
	teaser: {
		uk: 'Забруднене пір’я перестає гріти й тримати на воді. Мити птаха самотужки — найгірше, що можна зробити.',
		en: 'Fouled feathers stop insulating and stop floating. Washing the bird yourself is the worst thing you can do.'
	},
	answer: {
		uk: 'Не мийте. Загорніть у тканину, тримайте в теплі й темряві та телефонуйте.',
		en: 'Do not wash it. Wrap it in cloth, keep it warm and dark, and call.'
	},
	blocks: {
		intervene: {
			uk: 'Так. Забруднений птах сам не виживе: він перемерзне або отруїться, чистячи пір’я.',
			en: 'Yes. A fouled bird will not survive: it will freeze, or poison itself while preening.'
		},
		whenHelp: {
			uk: 'Завжди, коли на пір’ї є нафта, мазут чи олива — навіть якщо пляма здається малою.',
			en: 'Always, when there is oil or fuel on the feathers — even if the patch looks small.'
		},
		never: {
			uk: 'Не мийте мийним засобом, не годуйте, не напувайте насильно, не грійте феном.',
			en: 'Do not wash it with detergent, do not feed it, do not force water on it, do not warm it with a hairdryer.'
		},
		whenCall: {
			uk: 'Одразу. Скажіть, скільки птахів ви бачите: забруднення рідко буває на одному.',
			en: 'At once. Say how many birds you can see: a spill rarely touches just one.'
		}
	},
	story: {
		uk: 'Птахи після розливу палива: мити їх можна лише тоді, коли тварина стабільна, — і це роблять фахівці.',
		en: 'Birds after a fuel spill: washing is possible only once the animal is stable — and specialists do it.'
	},
	related: ['dolphin-stranded', 'window-strike', 'transport-mustelid']
};
