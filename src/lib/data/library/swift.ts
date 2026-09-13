import type { LibraryArticle } from './types';

export const swift: LibraryArticle = {
	slug: 'swift',
	emoji: '🐦',
	title: {
		uk: '…ви знайшли серпокрильця на землі?',
		en: '…you found a swift on the ground?'
	},
	teaser: {
		uk: 'Дізнайтеся, як відрізнити дорослого птаха від пташеняти та як правильно допомогти в кожному випадку.',
		en: 'Learn how to tell an adult bird from a fledgling, and how to help in each case.'
	},
	answer: {
		uk: 'Серпокрилець на землі — це майже завжди біда: злетіти з рівної поверхні він не може навіть здоровим.',
		en: 'A swift on the ground is almost always in trouble: it cannot take off from a flat surface even when healthy.'
	},
	blocks: {
		intervene: {
			uk: 'Так — на відміну від більшості птахів. Лапи серпокрильця пристосовані чіплятися за вертикальні поверхні, а не відштовхуватися від землі.',
			en: 'Yes — unlike most birds. A swift’s feet are built to cling to vertical surfaces, not to push off the ground.'
		},
		whenHelp: {
			uk: 'Завжди, коли птах сидить на землі й не злітає. Окремо — якщо видно кров, звисле крило, якщо птах мокрий, холодний або його знайшли в приміщенні.',
			en: 'Whenever the bird is on the ground and does not fly off. Especially if there is blood, a drooping wing, or the bird is wet, cold or found indoors.'
		},
		never: {
			uk: 'Не підкидайте птаха вгору, щоб «допомогти злетіти», не напувайте його силоміць і не годуйте хлібом, кашею чи м’ясом. Підкидання травмованого птаха додає переломів.',
			en: 'Do not toss the bird up to “help it fly”, do not force water into it and do not feed it bread, porridge or meat. Tossing an injured bird adds fractures.'
		},
		whenCall: {
			uk: 'Одразу. Помістіть птаха в картонну коробку з отворами, у тиші й темряві, і телефонуйте — серпокрильці погано переносять затримку.',
			en: 'Right away. Put the bird in a ventilated cardboard box, keep it quiet and dark, and call — swifts do badly with delay.'
		}
	},
	story: {
		uk: 'Осоїд, знайдений контуженим на вулицях міста після обстрілу, після складної реабілітації повернувся у дику природу.',
		en: 'A honey buzzard found concussed on city streets after shelling returned to the wild after a long rehabilitation.'
	},
	related: ['nestling', 'window-strike', 'bat']
};
