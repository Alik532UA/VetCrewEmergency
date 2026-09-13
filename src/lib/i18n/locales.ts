export const LOCALES = ['uk', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * Українська в корені, англійська під префіксом: `/library`, `/en/library`.
 *
 * Мова кореня — це рішення про аудиторію, а не про зручність. Сайт — цілодобова
 * гаряча лінія порятунку в Україні: людина, яка щойно знайшла поранену тварину,
 * відкриває головну з телефона й мусить одразу читати рідною. Зайвий крок
 * «перемкни мову» в цій ситуації коштує хвилин.
 *
 * Префікс на КОЖНІЙ мові, включно з типовою, тут неможливий: тоді `/` мусив би
 * віддавати перенаправлення на `/uk/`, а статичний хостинг уміє це лише
 * мета-оновленням сторінки — тобто зайвим кадром і зламаною кнопкою «назад».
 */
export const DEFAULT_LOCALE: Locale = 'uk';

/** Мови, що стоять сегментом шляху. */
export const PREFIXED_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

export const isLocale = (value: string): value is Locale =>
	(LOCALES as readonly string[]).includes(value);

/** `''` для типової мови, `/en` для решти. */
export const localeSegment = (locale: Locale): string =>
	locale === DEFAULT_LOCALE ? '' : `/${locale}`;

/**
 * Ділить шлях (без базового префікса) на мову й решту.
 * `/en/library` → `{ locale: 'en', path: '/library' }`
 */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
	const [, first = '', ...rest] = pathname.split('/');

	if (isLocale(first) && first !== DEFAULT_LOCALE) {
		return { locale: first, path: `/${rest.join('/')}` };
	}

	return { locale: DEFAULT_LOCALE, path: pathname === '' ? '/' : pathname };
}

/** Теги BCP 47 для `<html lang>` і hreflang. */
export const HTML_LANG: Record<Locale, string> = {
	uk: 'uk',
	en: 'en'
};
