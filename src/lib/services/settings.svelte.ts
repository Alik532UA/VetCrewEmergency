import { browser } from '$app/environment';
import { storage } from '$lib/services/storage';
import { logService } from '$lib/services/logService.svelte';

import { DEFAULT_LOCALE, isLocale, type Locale } from '$lib/i18n/locales';

export type Theme = 'dark' | 'light';
export type SiteStyle = 'modern' | 'minimal' | 'playful';
/**
 * Як поводиться проблисковий маячок.
 *
 * `temporary` — черга при появі пари на екрані й тиша до наступної; перша поява
 * дістає три черги, далі по одній.
 */
export type BeaconMode = 'off' | 'temporary' | 'always';
export type { Locale };

/**
 * Service for managing application settings like theme, locale, and favorites.
 * Uses Svelte 5 runes for reactivity and persists data to localStorage.
 */
class Settings {
	theme = $state<Theme>('dark');

	/** Language of the page being rendered. Owned by the URL, not by this class. */
	locale = $state<Locale>(DEFAULT_LOCALE);

	/** The language the visitor last chose, used to offer their language on arrival. */
	preferredLocale = $state<Locale | null>(null);

	/**
	 * Сучасний — вибір власника (2026-09-14), як і тема нижче.
	 *
	 * Це число живе ДВІЧІ: тут і в скрипті першого кадру `app.html`, який мусить
	 * поставити `data-style` ще до гідрації — інакше перший кадр малюється без
	 * жодного `--radius-*`, бо всі вони оголошені під `[data-style]`. Міняти
	 * доводиться обидва разом; розійдуться — і сторінка стрибне формою кутів на
	 * очах у читача.
	 */
	style = $state<SiteStyle>('modern');
	favorites = $state<string[]>([]);

	/*
	 * ВИГЛЯД, ЩО ПЕРЕМИКАЄТЬСЯ ВРУЧНУ.
	 *
	 * Чотири незалежні прапорці, а не п'ятий «стиль»: стиль — це цілісний набір
	 * рішень, і кожна нова пара значень подвоювала б їхню кількість. Тут же людина
	 * вимикає рівно те, що їй заважає, і решта лишається як була.
	 *
	 * Типові значення — те, як сайт виглядає СЬОГОДНІ: рамки й маячки є, скла
	 * немає. Так перше відкриття нічим не відрізняється від попереднього, а
	 * перемикач лишається вибором, а не зміною за людину.
	 */

	/** Облямівки по всьому сайту. */
	borders = $state(true);
	/** Скляна заливка кнопок «телефонувати» і «написати». */
	glassButtons = $state(false);
	/** Скляна заливка панелей, на яких лежать розділи. */
	glassPanels = $state(false);
	/**
	 * Проблискові маячки на парах кнопок.
	 *
	 * Типово тимчасові (вибір власника, 2026-09-14): маячок нагадує про себе, коли
	 * пара з'являється на екрані, і мовчить решту часу. Постійний лишився вибором,
	 * а не станом за замовчуванням.
	 */
	beacons = $state<BeaconMode>('temporary');

	/** Прапорець → ключ сховища → клас на `<html>`. Один перелік на всі три ролі. */
	static readonly LOOKS = [
		{ key: 'borders', css: 'no-borders', on: false },
		{ key: 'glassButtons', css: 'glass-buttons', on: true },
		{ key: 'glassPanels', css: 'glass-panels', on: true }
	] as const;

	private beaconModes: BeaconMode[] = ['off', 'temporary', 'always'];

	private themes: Theme[] = ['dark', 'light'];
	private styles: SiteStyle[] = ['modern', 'minimal', 'playful'];

	constructor() {
		if (browser) {
			logService.info('storage', 'Initializing settings via Storage Facade');

			/*
			 * Theme. The fallback must match the first-frame script in app.html, or the
			 * palette changes once on hydration.
			 *
			 * DELIBERATE EXCEPTION, at the owner's request rather than by a developer's
			 * preference. UI-UX-v8 says the first visit follows prefers-color-scheme, and
			 * that rule stands — it is right, and it stays in the instructions. This site
			 * opens on the green theme for everyone, because the owner wants the same first
			 * impression regardless of what a visitor's operating system happens to be set
			 * to. It costs the visitor nothing they cannot undo: the theme picker is in the
			 * header, and whatever they choose is remembered from then on.
			 *
			 * Recorded in PROJECT-CONTEXT.md § 4.16.
			 */
			const savedTheme = storage.get('theme') as Theme | null;
			this.theme = savedTheme && this.themes.includes(savedTheme) ? savedTheme : 'dark';

			// Seeded from the attribute the server already wrote, before any effect can
			// run. Starting at the default instead meant hydration briefly stamped
			// lang="en" onto a German page before the route locale arrived — long enough
			// for a screen reader, and for a test, to read the wrong language.
			const fromDocument = document.documentElement.lang;
			if (isLocale(fromDocument)) {
				this.locale = fromDocument;
			}

			// Only the preference is restored. The current language comes from the
			// route, so that a shared link always opens in the language it names.
			const savedLocale = storage.get('locale');
			if (savedLocale && isLocale(savedLocale)) {
				this.preferredLocale = savedLocale;
			}

			// Style
			const savedStyle = storage.get('style') as SiteStyle | null;
			if (savedStyle && this.styles.includes(savedStyle)) {
				this.style = savedStyle;
			}

			/*
			 * Вигляд. Читається порівнянням із рядком, а не `Boolean(...)`: у сховищі
			 * лежить `'true'`/`'false'`, і будь-який непорожній рядок — зокрема
			 * `'false'` — у булеве перетворення приходить істиною.
			 */
			for (const look of Settings.LOOKS) {
				const saved = storage.get(look.key);
				if (saved === 'true' || saved === 'false') this[look.key] = saved === 'true';
			}

			const savedBeacons = storage.get('beacons') as BeaconMode | null;
			if (savedBeacons && this.beaconModes.includes(savedBeacons)) this.beacons = savedBeacons;

			// Favorites
			const savedFavs = storage.getJSON<string[]>('favorites');
			if (savedFavs) {
				this.favorites = savedFavs;
				logService.info('storage', `Loaded ${this.favorites.length} favorites`);
			}
		}

		$effect.root(() => {
			$effect(() => {
				if (browser) {
					storage.set('theme', this.theme);
					document.documentElement.setAttribute('data-theme', this.theme);
					const meta = document.querySelector('meta[name="color-scheme"]');
					// Те саме, що в скрипті першого кадру: `only light` — відмова від
					// Auto Dark Theme на Android (UI-UX-v9 `UIUX-ONLY-LIGHT`).
					const темна = this.theme === 'dark';
					if (meta) meta.setAttribute('content', темна ? 'dark' : 'only light');
				}
			});

			// The attribute is written by hooks.server.ts during prerender; this keeps
			// it correct after a client-side navigation between languages.
			$effect(() => {
				if (browser) {
					document.documentElement.setAttribute('lang', this.locale);
				}
			});

			$effect(() => {
				if (browser) {
					storage.set('style', this.style);
					document.documentElement.setAttribute('data-style', this.style);
				}
			});

			$effect(() => {
				if (browser) {
					// $state.snapshot: a proxy crossing into JSON.stringify is the § 1.6 anti-pattern.
					storage.setJSON('favorites', $state.snapshot(this.favorites));
				}
			});

			/*
			 * Вигляд — і в сховище, і на `<html>`, одним ефектом.
			 *
			 * Клас вішається за ВІДХИЛЕННЯМ від типового (`no-borders`, `glass-panels`),
			 * а не за станом: сторінка без жодного класу виглядає рівно так, як
			 * виглядала до появи цих перемикачів, і перший кадр до гідрації не
			 * доводиться нічим лагодити.
			 */
			$effect(() => {
				if (browser) storage.set('beacons', this.beacons);
			});

			$effect(() => {
				if (!browser) return;
				for (const look of Settings.LOOKS) {
					const value = this[look.key];
					storage.set(look.key, String(value));
					document.documentElement.classList.toggle(look.css, value === look.on);
				}
			});
		});
	}

	setBeacons(mode: BeaconMode) {
		this.beacons = mode;
		logService.info('ui', `Beacons: ${mode}`);
	}

	/** Перемикає один із прапорців вигляду. */
	toggleLook(key: (typeof Settings.LOOKS)[number]['key']) {
		this[key] = !this[key];
		logService.info('ui', `Look ${key}: ${this[key]}`);
	}

	toggleTheme() {
		const currentIndex = this.themes.indexOf(this.theme);
		const nextIndex = (currentIndex + 1) % this.themes.length;
		this.theme = this.themes[nextIndex];
	}

	setTheme(theme: Theme) {
		this.previewedTheme = null;
		this.#startThemeShift();
		this.theme = theme;
	}

	/** Знімає клас плавного переходу, коли той доїхав (THEME-SWITCHER § 5). */
	#shiftTimer: ReturnType<typeof setTimeout> | null = null;

	/**
	 * Вмикає плавний перехід кольорів на час зміни теми.
	 *
	 * Тривалість із ЗАПАСОМ над 0,56 с із `styles/base.css`, а не те саме число
	 * — щоб не тримати копію тривалості у двох місцях. Знімає клас ЛИШЕ таймер:
	 * зняття в обробнику обривало б перехід на половині, бо вибір теми закриває
	 * меню, а його закриття кличе `previewTheme(null)`.
	 */
	#startThemeShift() {
		if (!browser) return;
		document.documentElement.classList.add('theme-shifting');
		if (this.#shiftTimer) clearTimeout(this.#shiftTimer);
		this.#shiftTimer = setTimeout(() => {
			document.documentElement.classList.remove('theme-shifting');
			this.#shiftTimer = null;
		}, 900);
	}

	/**
	 * Тема, яку показуємо «на пробу» під курсором, або `null`
	 * (THEME-SWITCHER § 2.1).
	 *
	 * ОКРЕМО від `theme`, і тут це критичніше, ніж деінде: `theme` слухає
	 * `$effect`, який на КОЖНУ зміну пише у сховище. Прев'ю в те саме поле
	 * означало б, що курсор, який просто перетнув меню, зберігає чужу тему
	 * назавжди — а `.active` при цьому їхала б за ним.
	 */
	previewedTheme = $state<Theme | null>(null);

	/**
	 * Показує тему «на пробу», поки курсор на її пункті; `null` — вертає обрану.
	 *
	 * Малює документ напряму, повз `$effect`: той прив'язаний до `theme`, і
	 * єдиний спосіб зачепити його — записати вибір, чого прев'ю робити не має.
	 * Мета-тег іде разом з атрибутом — інакше показана темна тема лишалася б
	 * оголошеною як світла, і Android Chrome перемальовував би її своєю Auto
	 * Dark Theme рівно на час показу.
	 */
	previewTheme(theme: Theme | null) {
		if (!browser) return;
		this.previewedTheme = theme;
		this.#startThemeShift();
		const shown = theme ?? this.theme;
		document.documentElement.setAttribute('data-theme', shown);
		const meta = document.querySelector('meta[name="color-scheme"]');
		const темна = shown === 'dark';
		if (meta) meta.setAttribute('content', темна ? 'dark' : 'only light');
	}

	/** Records an explicit choice by the visitor. Navigation is the caller's job. */
	setLocale(locale: Locale) {
		this.locale = locale;
		this.preferredLocale = locale;
		storage.set('locale', locale);
	}

	/** Applies the language of the current route without touching the stored preference. */
	applyRouteLocale(locale: Locale) {
		if (this.locale !== locale) this.locale = locale;
	}

	setStyle(style: SiteStyle) {
		this.style = style;
	}

	toggleFavorite(slug: string) {
		if (this.favorites.includes(slug)) {
			this.favorites = this.favorites.filter((f) => f !== slug);
			logService.info('storage', `Removed from favorites: ${slug}`);
		} else {
			this.favorites = [...this.favorites, slug];
			logService.info('storage', `Added to favorites: ${slug}`);
		}
	}

	isFavorite(slug: string) {
		return this.favorites.includes(slug);
	}
}

export const settings = new Settings();
