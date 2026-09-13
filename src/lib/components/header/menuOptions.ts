import type { TranslationKey } from '$lib/i18n';
import type { Locale, SiteStyle, Theme } from '$lib/services/settings.svelte';

/**
 * What the three header menus offer — separated from how the header behaves.
 *
 * These are lists, not logic: an id, a label and the glyph beside it. They moved out of
 * `HeaderControls.svelte` when that file reached its size limit (PROJECT-STRUCTURE-v8
 * § 7), and this was the honest seam — the component keeps the one thing it owns, which
 * is that only one of the three menus may be open, and stops also being the place where
 * the fourth theme is added.
 *
 * Colocated rather than in `$lib/data/`: nothing outside the header renders them, and a
 * shared home would invite a second consumer with different needs.
 */

export const LOCALE_OPTIONS: { id: Locale; label: string; flags: string[] }[] = [
	{ id: 'uk', label: 'Українська', flags: ['/images/flags/uk.svg'] },
	{ id: 'en', label: 'English', flags: ['/images/flags/en.svg'] }
];

export const STYLE_OPTIONS: {
	id: SiteStyle;
	labelKey: TranslationKey;
	icon: 'sparkles' | 'minimal' | 'playful';
}[] = [
	/*
	 * Minimal is deliberately absent from this list, not deleted.
	 *
	 * Its stylesheet, its tokens and its handling everywhere else are intact, and
	 * setting the stored value by hand still applies it — it is simply not offered.
	 * Removing the code would make bringing it back a rewrite instead of a line.
	 */
	{ id: 'playful', labelKey: 'style.playful', icon: 'playful' },
	{ id: 'modern', labelKey: 'style.modern', icon: 'sparkles' }
];

export const THEME_OPTIONS: {
	id: Theme;
	labelKey: TranslationKey;
	icon: 'moon' | 'sun';
}[] = [
	// Та, у якій сайт відкривається, стоїть першою; друга — альтернатива до неї.
	{ id: 'dark', labelKey: 'theme.dark', icon: 'moon' },
	{ id: 'light', labelKey: 'theme.light', icon: 'sun' }
];
