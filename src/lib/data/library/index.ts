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
import { fox_kit } from './fox-kit';
import { fox_in_city } from './fox-in-city';
import { fox_mange } from './fox-mange';
import { turtle_road } from './turtle-road';
import { snake_encounter } from './snake-encounter';
import { amphibian_found } from './amphibian-found';
import { dolphin_stranded } from './dolphin-stranded';
import { oiled_bird } from './oiled-bird';
import { hedgehog_winter } from './hedgehog-winter';
import { bat_indoors } from './bat-indoors';
import { ungulate_entangled } from './ungulate-entangled';
import { leveret_mowing } from './leveret-mowing';
import type { ArticleGroup, LibraryArticle } from './types';

export type { ArticleGroup, LibraryArticle, Localized } from './types';

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
	transport_mustelid,
	/*
	 * Групи, яких у бібліотеці не було зовсім: лисиці, рептилії, морські мешканці —
	 * і доповнення до тих, що мали по одній статті.
	 *
	 * Тільки короткі поля, без довгих текстів. Довгий текст — це фахове знання
	 * організації, і писати його за неї означало б поставити на сайт поради, за які
	 * ніхто зсередини не відповідає.
	 */
	fox_kit,
	fox_in_city,
	fox_mange,
	turtle_road,
	snake_encounter,
	amphibian_found,
	dolphin_stranded,
	oiled_bird,
	hedgehog_winter,
	bat_indoors,
	ungulate_entangled,
	leveret_mowing
];

/** Ті чотири, що показані на головній. */
export const LIBRARY_FEATURED = LIBRARY.slice(0, 4);

export const findArticle = (slug: string): LibraryArticle | undefined =>
	LIBRARY.find((a) => a.slug === slug);

/**
 * Порядок груп на сторінці — і він не алфавітний.
 *
 * Спершу ті, кого приносять найчастіше: птахи й їжаки — це більшість дзвінків
 * будь-якої рятувальної служби. Далі решта видів, і наприкінці `any` — те, що
 * читають, уже знаючи, кого зустріли.
 *
 * Перелік тут, а не в компоненті: сторінка бібліотеки й майбутні фільтри мусять
 * брати один порядок, інакше вони розійдуться на першій же новій групі.
 */
export const GROUP_ORDER: readonly ArticleGroup[] = [
	'birds',
	'hedgehogs',
	'bats',
	'mustelids',
	'foxes',
	'ungulates',
	'hares',
	'reptiles',
	'marine',
	'any'
];

/** Значок групи. Поруч із назвою в смузі переходів — щоб група впізнавалася оком. */
export const GROUP_EMOJI: Record<ArticleGroup, string> = {
	birds: '🐦',
	hedgehogs: '🦔',
	bats: '🦇',
	mustelids: '🦡',
	foxes: '🦊',
	ungulates: '🦌',
	hares: '🐇',
	reptiles: '🐢',
	marine: '🐬',
	any: '📋'
};

/**
 * Статті, згруповані в порядку `GROUP_ORDER`. Порожні групи не потрапляють сюди
 * взагалі: смуга переходів із назвою, за якою нічого немає, — це обіцянка, якої
 * сторінка не тримає.
 */
export const LIBRARY_BY_GROUP: readonly { group: ArticleGroup; items: LibraryArticle[] }[] =
	GROUP_ORDER.map((group) => ({
		group,
		items: LIBRARY.filter((a) => a.group === group)
	})).filter((g) => g.items.length > 0);
