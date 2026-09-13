import type { BetaCheck } from '../types';

/**
 * Історії порятунку.
 *
 * Тут перевіряється чесність обсягу: повних текстів ще немає, і сторінка не
 * мусить удавати, ніби вони є.
 */
export const storyChecks: readonly BetaCheck[] = [
	{
		id: 'stories_1',
		category: { uk: 'Перелік', en: 'The list' },
		text: {
			uk: 'Відкрийте «Історії порятунку». Кожна картка мусить мати заголовок і абзац — карток із самим заголовком бути НЕ мусить.',
			en: 'Open “Rescue stories”. Every card must have a heading and a paragraph — cards with a heading alone must NOT appear.'
		},
		testid: 'stories-list',
		negative: true,
		coverage: 'manual'
	},
	{
		id: 'stories_2',
		category: { uk: 'Сторінка історії', en: 'Story page' },
		text: {
			uk: 'Відкрийте будь-яку історію. Сторінка мусить показати те, що є, і не мусить мати порожніх місць із підписами на кшталт «фото буде пізніше».',
			en: 'Open any story. The page must show what exists and must not carry empty slots labelled “photo coming later”.'
		},
		negative: true,
		coverage: 'manual'
	},
	{
		id: 'stories_3',
		category: { uk: 'Зв’язок із бібліотекою', en: 'Link to the library' },
		text: {
			uk: 'У статті бібліотеки блок «Реальна історія порятунку» мусить вести на сторінку тієї історії, а не на загальний перелік.',
			en: 'In a library article the “A real rescue” block must lead to that story’s page, not to the general list.'
		},
		testid: 'article-story-link',
		coverage: 'manual'
	}
];
