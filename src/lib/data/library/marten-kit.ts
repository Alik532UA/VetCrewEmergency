import rawBody from './bodies/marten-kit.json';
import { asBody } from './types';
import type { LibraryArticle } from './types';

export const marten_kit: LibraryArticle = {
	slug: 'marten-kit',
	group: 'mustelids',
	emoji: '🦡',
	title: {
		uk: '…ви знайшли дитинча куниці, ласки або перегузні?',
		en: '…you found a marten, weasel or polecat kit?'
	},
	teaser: {
		uk: 'Дізнайтеся, коли дитинча справді потребує допомоги, а коли найкраще, що ви можете зробити, — залишити його у природі.',
		en: 'Learn when a kit truly needs help, and when the best thing you can do is leave it in the wild.'
	},
	answer: {
		uk: 'Здорове дитинча куницевих не «загубилося» — мати поруч і повернеться. Найчастіший «порятунок» тут якраз і є шкодою.',
		en: 'A healthy mustelid kit is not “lost” — the mother is nearby and will come back. Here the usual “rescue” is the harm.'
	},
	blocks: {
		intervene: {
			uk: 'Ні, якщо дитинча зовні ціле й спокійне. Самка переносить малят по одному й може бути відсутньою годинами.',
			en: 'No, if the kit looks unhurt and calm. The female moves her kits one by one and can be away for hours.'
		},
		whenHelp: {
			uk: 'Якщо видно кров чи рани, якщо дитинча холодне, мляве, обліплене мухами, якщо поруч загинула самка або на нього полює кіт чи собака.',
			en: 'If there is blood or wounds, if the kit is cold, limp or fly-blown, if the mother is dead nearby, or a cat or dog is hunting it.'
		},
		never: {
			uk: 'Не забирайте додому й не годуйте коров’ячим молоком, кашею чи овочами — неправильне годування дитинчат куницевих часто коштує життя. Вирощена людиною куниця не стає домашньою твариною.',
			en: 'Do not take it home and do not feed it cow’s milk, porridge or vegetables — wrong feeding often kills mustelid kits. A hand-raised marten does not become a pet.'
		},
		whenCall: {
			uk: 'Якщо є будь-яка з ознак вище або ви просто не впевнені, що перед вами. Куницю, ласку, перегузню й домашнього тхора плутають постійно — надішліть фото.',
			en: 'If any of the signs above are present, or you simply are not sure what you are looking at. Martens, weasels, polecats and pet ferrets are confused constantly — send a photo.'
		}
	},
	body: asBody(rawBody),
	story: {
		uk: 'Куниця, що заплуталася в антидроновій сітці на фронті: попереду була складна операція та довге відновлення.',
		en: 'A marten tangled in anti-drone netting at the front: a complex surgery and a long recovery lay ahead.'
	},
	// Перелік із самого матеріалу: автор писав ці статті як пов'язані.
	related: ['mustelids-id', 'why-not-take-kits', 'marten-in-city']
};
