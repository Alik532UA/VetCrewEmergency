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
import { mustelids_id } from './mustelids-id';
import { why_not_take_kits } from './why-not-take-kits';
import { mustelids_near_us } from './mustelids-near-us';
import { marten_in_city } from './marten-in-city';
import { ferret_escaped } from './ferret-escaped';
import { ferret_found } from './ferret-found';
import { transport_mustelid } from './transport-mustelid';
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
	hare,
	/*
	 * Матеріал про куницевих, поданий одним блоком (2026-09-18).
	 *
	 * Стоїть у кінці, а не врозкид: `LIBRARY_FEATURED` бере перші чотири, і будь-яка
	 * вставка на початок мовчки змінила б те, що показує головна.
	 *
	 * Усі сім тимчасово одномовні — див. коментар у будь-якому з файлів.
	 */
	mustelids_id,
	why_not_take_kits,
	mustelids_near_us,
	marten_in_city,
	ferret_escaped,
	ferret_found,
	transport_mustelid
];

/** Ті чотири, що показані на головній. */
export const LIBRARY_FEATURED = LIBRARY.slice(0, 4);

export const findArticle = (slug: string): LibraryArticle | undefined =>
	LIBRARY.find((a) => a.slug === slug);
