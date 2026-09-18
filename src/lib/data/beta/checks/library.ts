import type { BetaCheck } from '../types';

/**
 * Бібліотека порад.
 *
 * Ці сторінки читають у полі, з телефона, поспіхом — тому перевіряється не
 * «чи є текст», а чи видно ПЕРШЕ речення без прокрутки: у ньому вся відповідь.
 */
export const libraryChecks: readonly BetaCheck[] = [
	{
		id: 'library_1',
		category: { uk: 'Порядок читання', en: 'Reading order' },
		text: {
			uk: 'Відкрийте будь-яку статтю на телефоні. Коротка відповідь одним реченням мусить бути видна ОДРАЗУ, без прокрутки — до заголовків «Чи потрібно втручатися?» і далі.',
			en: 'Open any article on a phone. The one-sentence answer must be visible AT ONCE, without scrolling — before “Should you step in?” and the rest.'
		},
		coverage: 'manual'
	},
	{
		id: 'library_2',
		category: { uk: 'Порядок читання', en: 'Reading order' },
		text: {
			uk: 'Пройдіть три різні статті. Порядок блоків мусить бути однаковий у кожній: втручатися → коли потрібна допомога → чого не можна → коли телефонувати.',
			en: 'Read three different articles. The order of the blocks must be the same in each: step in → when help is needed → what never to do → when to call.'
		},
		coverage: 'testable'
	},
	{
		id: 'library_3',
		category: { uk: 'Червона картка', en: 'Red card' },
		text: {
			uk: 'У кінці кожної статті мусить стояти червона картка з гарячою лінією. Натисніть кнопку на ній — мусить відкритися сторінка повідомлення про тварину.',
			en: 'Every article must end with a red card carrying the hotline. Press its button — the animal report page must open.'
		},
		testid: 'article-report-btn',
		coverage: 'manual'
	},
	{
		id: 'library_4',
		category: { uk: 'Схожі статті', en: 'Related articles' },
		text: {
			uk: 'Натисніть будь-яке посилання в блоці «Схожі статті». Сторінка мусить відкритися, а не віддати «не знайдено».',
			en: 'Press any link in the “Related articles” block. The page must open rather than return a “not found”.'
		},
		// Перелік, а не окреме посилання: у кожного з них тепер власний локатор із
		// гаслом статті, бо один спільний робив E2E-локатори недетермінованими.
		testid: 'article-related-list',
		coverage: 'testable'
	},
	{
		id: 'library_5',
		category: { uk: 'Перелік', en: 'The list' },
		text: {
			uk: 'Відкрийте «Вся бібліотека». Угорі мусить бути смуга груп тварин із числом статей у кожній; натиск на групу прокручує до неї, а не ховає решту. У переліку мусять бути ВСІ статті, а не лише ті чотири, що на головній.',
			en: 'Open “The whole library”. A bar of animal groups with a count for each must sit at the top; pressing a group scrolls to it rather than hiding the rest. Every article must be in the list, not only the four on the home page.'
		},
		testid: 'library-list',
		coverage: 'manual'
	},
	{
		id: 'library_6',
		category: { uk: 'Порядок читання', en: 'Reading order' },
		text: {
			uk: 'Пройдіть статтю до кінця. Порад на кшталт «дайте молока», «заберіть додому» чи «погодуйте» в блоці «Чого не можна робити» бути НЕ мусить — цей блок саме про протилежне.',
			en: 'Read an article to the end. Advice like “give it milk”, “take it home” or “feed it” must NOT appear in the “What you must never do” block — that block says the opposite.'
		},
		negative: true,
		coverage: 'manual'
	}
];
