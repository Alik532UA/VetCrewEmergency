import type { BetaCheck } from '../types';

/**
 * Збережені поради.
 *
 * Той самий механізм, що був «обраним» у проєкті-джерелі, але предмет інший:
 * людина зберігає не тварину, а інструкцію, щоб відкрити її, коли ситуація
 * повториться. Перевірка та сама: позначка мусить пережити перезавантаження.
 */
export const favoriteChecks: readonly BetaCheck[] = [
	{
		id: 'saved_1',
		category: { uk: 'Збереження', en: 'Saving' },
		text: {
			uk: 'Натисніть значок збереження на будь-якій статті, тоді відкрийте «Збережені поради». Стаття мусить бути в переліку.',
			en: 'Press the save icon on any article, then open “Saved advice”. The article must be in the list.'
		},
		testid: 'article-save-btn',
		coverage: 'manual'
	},
	{
		id: 'saved_2',
		category: { uk: 'Збереження', en: 'Saving' },
		text: {
			uk: 'Перезавантажте сторінку. Збережені поради мусять лишитися — список НЕ мусить спорожніти.',
			en: 'Reload the page. The saved advice must stay — the list must NOT empty itself.'
		},
		negative: true,
		coverage: 'testable'
	},
	{
		id: 'saved_3',
		category: { uk: 'Порожній стан', en: 'Empty state' },
		text: {
			uk: 'Зніміть усі позначки. Сторінка мусить пояснити, що список порожній, і запропонувати перейти до бібліотеки — а не показати порожнечу.',
			en: 'Clear every mark. The page must explain that the list is empty and offer a way to the library — not show blankness.'
		},
		testid: 'saved-empty-message',
		coverage: 'manual'
	}
];
