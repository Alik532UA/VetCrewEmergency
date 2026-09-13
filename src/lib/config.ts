import { localeSegment, type Locale } from '$lib/i18n/locales';
import type { SiblingId } from '$lib/siblings';
import type { TranslationKey } from '$lib/i18n/translations/en';
import type { ScrollbarMode } from '$lib/services/scrollbar.svelte';
import type { IconName } from '$lib/components/ui/icons';

/**
 * Absolute origin of the deployed site.
 *
 * Not derived from `page.url.origin`: during prerendering SvelteKit replaces the
 * origin with the placeholder host `sveltekit-prerender`, which would then be
 * baked into every canonical, og:url and sitemap entry.
 *
 * Override at build time with SITE_ORIGIN when the site moves to another host.
 */
export const SITE_ORIGIN = __SITE_ORIGIN__;

/**
 * Base path as a literal string.
 *
 * A literal rather than `base` from `$app/paths`, and still a literal now that
 * `paths.relative` is `false` and the two agree.
 *
 * They did not agree before: SvelteKit rewrote `base` to a *relative* prefix in
 * prerendered HTML, so `SITE_ORIGIN + base + path` came out as
 * `https://example.com/../../images/x.jpg` — an absolute URL with a relative middle,
 * which every crawler reads as a different address. That is fixed at the source now,
 * but this constant stays independent of the setting on purpose: an origin-prefixed
 * URL must not quietly change meaning if `paths.relative` is ever flipped back.
 */
export const SITE_BASE = __BASE_PATH__;

/**
 * Routes that are served in every language and kept out of the index
 * (BETA-CHECKLIST-v8 § 4, § 4.1).
 *
 * One list, three consequences, and that is the point of it being a list. The layout
 * draws no `canonical`, no `hreflang` and no `og:url` for these paths and writes
 * `noindex` instead; the sitemap filters them out; `robots.txt` disallows every
 * language of each. Before this they were hidden by three unrelated edits in three
 * files, so hiding a second route meant remembering all three — and forgetting one of
 * them looks exactly like remembering it.
 *
 * `/apply/form` — the form that came before the embedded Google one, kept against the
 * day applications come back to the site (PROJECT-CONTEXT § 4.12).
 *
 * Hidden is not secret, and pretending otherwise is self-deception: the repository is
 * public and the address works for anyone who types it. It is kept out of the index so
 * a search for an animal does not land on a page for testers.
 */
export const HIDDEN_ROUTES = ['/beta-test-checklists'] as const;

export const isHiddenRoute = (path: string): boolean =>
	(HIDDEN_ROUTES as readonly string[]).includes(path);

/**
 * The pages that exist independently of the data — everything except an animal's
 * own page, which comes from `animalService`.
 *
 * Here rather than in the sitemap because it is no longer the sitemap's alone:
 * `llms.txt` walks the same list. Written out twice, the second copy is what
 * eventually names a page that does not exist — which is precisely how `llms.txt`
 * came to advertise `/process`, `/partners` and `/about`, none of which this site
 * has ever had.
 */
export const INDEXED_PATHS = ['/', '/library', '/stories', '/about', '/support'] as const;

/**
 * Contact addresses, in one place. They used to be typed out in the footer and again
 * in the apply form, which is how two copies of the same address start to differ.
 */
export const CONTACT_EMAIL = {
	rescue: 'alikvetcrew@gmail.com'
} as const;

/**
 * Гаряча лінія — ЗАГЛУШКА, і вона навмисно виглядає заглушкою.
 *
 * Справжнього номера в матеріалах немає: у специфікації рядок обірваний
 * («+38 (0»), у дизайн-референсі стоїть очевидно вигаданий 067 123 45 67.
 * Підставити правдоподібний номер було б найгіршим із можливого — сайт
 * цілодобової служби порятунку не має права дати людині номер, за яким ніхто
 * не відповість. Тому тут нулі: їх видно і в макеті, і в зібраному сайті.
 *
 * `tel` — те, що піде в `href="tel:"`, `display` — те, що читає людина.
 */
export const HOTLINE = {
	tel: '+380000000000',
	display: '+38 (000) 000 00 00'
} as const;

/** Адреса, куди приходять повідомлення про знайдену тварину. */
export const REPORT_EMAIL = CONTACT_EMAIL.rescue;

/**
 * Куди веде «Повідомити про знахідку» — і чому це не сторінка сайту.
 *
 * Форми на сайті поки не буде (рішення автора, 2026-09-13), тож усі кнопки
 * повідомлення ведуть у Telegram. Сама сторінка `/report` нікуди не поділася —
 * вона лежить у `routes/[[lang=lang]]/_report/` і не збирається: SvelteKit
 * типово пропускає все, чий шлях містить сегмент із підкресленням на початку.
 * Повернути її — це перейменувати теку назад і повернути `/report` у
 * `INDEXED_PATHS`, а тут поставити `localePath('/report', lang)`.
 *
 * Зовнішня адреса, тому кожне посилання на неї мусить мати
 * `target="_blank" rel="noopener noreferrer"` — інакше людина з наполовину
 * заповненим повідомленням ідe геть зі сторінки.
 */
export const REPORT_URL = 'https://t.me/alik532';

/** Фізична адреса — зі специфікації. */
export const ADDRESS = {
	uk: 'Одеська обл., м. Одеса, вул. Майстрова 4',
	en: 'Maistrova St. 4, Odesa, Odesa Oblast, Ukraine'
} as const;

/** Image used for link previews when a page has nothing more specific. */
export const DEFAULT_OG_IMAGE = '/images/logo/vetcrew.webp';

/** Absolute URL from a site-root-relative path, i.e. one that does *not* include the base. */
export const absoluteFromRoot = (path: string): string =>
	`${SITE_ORIGIN}${SITE_BASE}${path.startsWith('/') ? path : `/${path}`}`;

/**
 * Same URL, built from its parts instead of from the module constants.
 *
 * Split out so the rule below can be tested at all. `SITE_BASE` is empty in every
 * environment except the deploy build — `BASE_PATH` is only ever set by the
 * workflow — and the trailing slash matters *only* when it is not. A test that
 * calls `absoluteLocale()` therefore exercises the one case that was already
 * right, which is how the defect below survived three audits with every gate green.
 */
export const localeUrl = (origin: string, base: string, path: string, locale: Locale): string => {
	const root = `${origin}${base}`;
	const url = `${root}${localeSegment(locale)}${path === '/' ? '' : path}`;

	/*
	 * The site root is a directory, and a static host answers a directory URL
	 * without the trailing slash with a 301 to the one that has it. Verified
	 * against the live server: `https://alik532ua.github.io/VetCrewEmergency`
	 * redirects, `…/VetCrewEmergency/` is the page.
	 *
	 * A canonical, an `og:url`, an `x-default` or a sitemap `<loc>` naming the
	 * redirecting form is the page telling a crawler an address that the server
	 * then tells it is wrong — the site's own declaration is the one thing
	 * discarded. It stood on the four language home pages and on the sitemap
	 * entry with priority 1.0.
	 *
	 * The rule this replaces compared the URL against the ORIGIN, so it covered
	 * the case only while `base` was empty. Written against the root, it covers
	 * both, and the empty-base case reduces to exactly what was there before.
	 */
	return url === root ? `${root}/` : url;
};

/**
 * Absolute URL of a page in a given language, from a locale-free path such as
 * `/adopt/cat`. Used for canonical and for the hreflang alternates, which have to
 * be absolute to mean anything to a crawler.
 */
export const absoluteLocale = (path: string, locale: Locale): string =>
	localeUrl(SITE_ORIGIN, SITE_BASE, path, locale);

/**
 * The scrollbar modes, in one place (SCROLLBAR-v8 § 2.2).
 *
 * Rendered by the bar's context menu, and by a settings panel too if this site grows
 * one. Two copies drift the moment a fifth mode is added and one of the places forgets
 * it. Order runs from the familiar to the most expensive.
 */
export const SCROLLBAR_MODES: { id: ScrollbarMode; key: TranslationKey }[] = [
	{ id: 'standard', key: 'scrollbar.standard' },
	{ id: 'custom', key: 'scrollbar.custom' },
	{ id: 'minimap', key: 'scrollbar.minimap' },
	{ id: 'minimap-full', key: 'scrollbar.minimapFull' }
];

/**
 * The shelter's other sites, offered quietly from the footer.
 *
 * Deliberately understated: they are not what someone came here for, and a visitor
 * looking for an animal should not be advertised at. See the opacity rules on
 * `.footer__aside` in Footer.svelte.
 *
 * `site` rather than a written-out `url`, because the address depends on the language
 * the visitor is reading and only `siblingUrl` knows how each neighbour spells that.
 * A literal here was the whole defect: both links pointed at a bare path, and a bare
 * path is Ukrainian on both of those sites regardless of where the reader came from.
 */
export const SIDE_PROJECTS = [
	{
		id: 'games',
		site: 'vetcrewgames',
		icon: 'gamepad',
		key: 'footer.play'
	},
	{
		id: 'order-site',
		site: 'digitalworkshop',
		icon: 'plus',
		key: 'footer.orderSite'
	}
] as const satisfies readonly {
	id: string;
	site: SiblingId;
	icon: IconName;
	key: TranslationKey;
}[];

/**
 * Офіційні акаунти Vet Crew у соцмережах.
 */
export const SOCIALS = [
	{
		id: 'instagram',
		url: 'https://www.instagram.com/vet.crew/',
		icon: '/images/social_media/instagram-se-512-50.png'
	},
	{
		id: 'facebook',
		url: 'https://www.facebook.com/vet.crew/',
		icon: '/images/social_media/facebook-se-512-50.png'
	},
	{
		id: 'tiktok',
		url: 'https://www.tiktok.com/@vet.crew',
		icon: '/images/social_media/TikTok-se-512-50.png'
	},
	{
		id: 'x',
		url: 'https://x.com/crew_vet',
		icon: '/images/social_media/Twitter-SE-512-50q.png'
	}
] as const;
