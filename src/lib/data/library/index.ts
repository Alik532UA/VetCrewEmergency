import { fawn } from './fawn';
import { swift } from './swift';
import { marten_kit } from './marten-kit';
import { owlet } from './owlet';
import { nestling } from './nestling';
import { hedgehog } from './hedgehog';
import { bat } from './bat';
import { swan_line } from './swan-line';
import { window_strike } from './window-strike';
import { hare } from './hare';
import type { LibraryArticle } from './types';

export type { LibraryArticle, Localized } from './types';

/**
 * Бібліотека «Що робити, якщо…» — порядок тут і є порядком на сторінці.
 *
 * Перші чотири збігаються з тими, що стоять на головній: специфікація показує
 * саме їх, і другий список для головної розійшовся б із цим за першої ж правки.
 */
export const LIBRARY: readonly LibraryArticle[] = [
	fawn,
	swift,
	marten_kit,
	owlet,
	nestling,
	hedgehog,
	bat,
	swan_line,
	window_strike,
	hare
];

/** Ті чотири, що показані на головній. */
export const LIBRARY_FEATURED = LIBRARY.slice(0, 4);

export const findArticle = (slug: string): LibraryArticle | undefined =>
	LIBRARY.find((a) => a.slug === slug);
