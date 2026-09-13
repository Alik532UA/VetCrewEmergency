import type { BetaCheck } from '../types';

/**
 * Головна — дев'ять розділів однієї довгої сторінки.
 *
 * Перший пункт тут не про красу, а про номер гарячої лінії: це єдине, заради
 * чого людина відкриває цей сайт о третій ночі.
 */
export const homeChecks: readonly BetaCheck[] = [
	{
		id: 'home_1',
		category: { uk: 'Гаряча лінія', en: 'Hotline' },
		text: {
			uk: 'Відкрийте головну на телефоні. Номер гарячої лінії мусить бути видно БЕЗ прокрутки, і натиск по ньому мусить відкрити застосунок дзвінка з підставленим номером.',
			en: 'Open the home page on a phone. The hotline number must be visible WITHOUT scrolling, and tapping it must open the dialler with the number filled in.'
		},
		testid: 'hotline-btn',
		coverage: 'manual'
	},
	{
		id: 'home_2',
		category: { uk: 'Гаряча лінія', en: 'Hotline' },
		text: {
			uk: 'Подивіться на номер у шапці й на номер у підвалі. Це мусить бути ОДИН і той самий номер — різні номери на одній сторінці читаються як помилка.',
			en: 'Compare the number in the header with the one in the footer. It must be the SAME number — two different numbers on one page read as a mistake.'
		},
		coverage: 'testable'
	},
	{
		id: 'home_3',
		category: { uk: 'Розділи', en: 'Sections' },
		text: {
			uk: 'Натисніть кожен пункт меню в шапці. Сторінка мусить плавно перейти до відповідного розділу, а не стрибнути на початок.',
			en: 'Press every menu item in the header. The page must scroll smoothly to that section rather than jumping to the top.'
		},
		testid: 'header-logo-link',
		coverage: 'manual'
	},
	{
		id: 'home_4',
		category: { uk: 'Розділи', en: 'Sections' },
		text: {
			uk: 'Пройдіть головну до кінця. Порожніх карток, написів «текст буде пізніше» чи заголовків без вмісту бути НЕ мусить.',
			en: 'Scroll the home page to the end. There must be NO empty cards, no “text coming later” labels and no headings without content.'
		},
		negative: true,
		coverage: 'manual'
	},
	{
		id: 'home_5',
		category: { uk: 'Бібліотека', en: 'Library' },
		text: {
			uk: 'У розділі «Що робити, якщо…» натисніть «Як діяти» на будь-якій картці. Мусить відкритися стаття саме про ту тварину, що на картці.',
			en: 'In the “What to do if…” section press “What to do” on any card. The article that opens must be about the animal on that card.'
		},
		testid: 'library-card-link',
		coverage: 'manual'
	}
];
