<script lang="ts">
	import { browser } from '$app/environment';
	import { withBase, localePath } from '$lib/utils/withBase';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { acceptsShortcut } from '$lib/services/keyboard';
	import { createKeySequence } from '$lib/services/keySequence';
	import { storage } from '$lib/services/storage';
	import { t } from '$lib/i18n';
	import { splitLocale } from '$lib/i18n/locales';
	import {
		settings,
		type BeaconMode,
		type Locale,
		type SiteStyle,
		type Theme
	} from '$lib/services/settings.svelte';
	import {
		BEACON_OPTIONS,
		LOCALE_OPTIONS,
		LOOK_OPTIONS,
		STYLE_OPTIONS,
		THEME_OPTIONS
	} from './menuOptions';

	/** Ключ прапорця вигляду — той самий перелік, що в `menuOptions`. */
	type LookKey = (typeof LOOK_OPTIONS)[number]['key'];
	import Icon from '$lib/components/ui/Icon.svelte';
	import DropdownMenu from '$lib/components/ui/DropdownMenu.svelte';

	/**
	 * The box a flag occupies, stated on the element as well as in CSS.
	 *
	 * The same two numbers as `.header__flag` below, and they have to be: the attributes
	 * reserve the space before any stylesheet arrives, the CSS keeps it once one has.
	 * Without them the row reflows on first paint — smaller than it was, now that the
	 * flag appears only inside the open settings menu rather than on the bar itself, but
	 * a reflow all the same. The flags are SVGs of differing natural size, hence a fixed
	 * pair rather than the file's own dimensions: `object-fit: cover` crops to this box.
	 */
	const FLAG_WIDTH = 20;
	const FLAG_HEIGHT = 14;

	/**
	 * Тема, стиль і мова — під однією кнопкою «Налаштування».
	 *
	 * Було три кнопки поспіль у смузі, кожна зі своїм меню. Три однакові на вигляд
	 * значки праворуч від навігації читалися як три невідомі дії, а в
	 * дизайн-референсі праворуч стоїть рівно один елемент — номер гарячої лінії.
	 * Тепер це одне меню з трьома групами, як у сусідніх проєктах автора
	 * (`teatralo4ka.odesa.ua`, `as5.odesa.ua`).
	 *
	 * Стан лишився булевим по суті, але записаний як `'settings' | null`, а не
	 * `boolean`: `DropdownMenu` приймає `open`/`onToggle` саме такою парою, і
	 * перейменування на `settingsOpen` дало б другу назву тому самому.
	 */
	let openMenu = $state<'settings' | null>(null);

	/**
	 * ПРИХОВАНО ДО ЗАПУСКУ (рішення автора, 2026-09-13).
	 *
	 * За замовчуванням приховано, але можна відобразити (або знову приховати),
	 * натиснувши клавішу `h` 7 разів підряд.
	 */
	let visible = $state(browser && storage.session.get('header_controls_visible') === '1');

	const headerSequence = createKeySequence({
		code: 'KeyH', // home / header controls toggle gesture
		threshold: 7,
		onComplete: () => {
			visible = !visible;
			storage.session.set('header_controls_visible', visible ? '1' : '0');
		}
	});

	$effect(() => {
		return () => headerSequence.reset();
	});

	/**
	 * Один список на три групи, тож ідентифікатори мусять бути унікальні між ними.
	 *
	 * Префікс несе й другу роботу: за ним `onselect` розрізняє, що саме обрали, і
	 * `onPreview` пропускає все, крім тем. Меню, яке від наведення на «Українська»
	 * почало б міняти тему, — це дефект, а не фіча.
	 */
	const THEME_PREFIX = 'theme-';
	const STYLE_PREFIX = 'style-';
	const LANG_PREFIX = 'lang-';
	const LOOK_PREFIX = 'look-';
	const BEACON_PREFIX = 'beacon-';

	/*
	 * Close on any outside click. In an $effect so the listener leaves with the component
	 * instead of outliving it.
	 *
	 * This is also why the header no longer resets these when its mobile menu closes:
	 * whatever closed that menu was itself a click, so it reaches this listener too.
	 */
	$effect(() => {
		const close = () => (openMenu = null);
		window.addEventListener('click', close);
		return () => window.removeEventListener('click', close);
	});

	/**
	 * Hotkeys: `T` theme, `L` language menu, `Esc` close (HOTKEYS-v8 § 1.1).
	 *
	 * Here rather than in the layout because both need `openMenu`, which this component
	 * owns; a second owner elsewhere would eventually disagree with the buttons.
	 *
	 * `T` cycles but `L` opens the MENU, and that is not taste: the theme is client-side
	 * and instant, while switching language is NAVIGATION (`localeHref` is an `href`), so
	 * "next language" would mean up to three page loads to reach the wanted one.
	 *
	 * Both letters are announced on the button they drive, via `keyshortcuts` below
	 * (§ 5). `V` and `R` live in `ServiceGestures.svelte` and stay unannounced — they
	 * are service gestures, not something to offer a visitor.
	 */
	function handleShortcut(event: KeyboardEvent) {
		headerSequence.handle(event);

		if (!acceptsShortcut(event)) return;

		// One `else return` rather than a `preventDefault` per branch: that way the key is
		// only ever swallowed once something has happened (HOTKEYS-v8 § 2.4). `Escape` with
		// nothing open falls through here, which is what lets it keep its usual meaning.
		if (event.code === 'Escape' && openMenu !== null) openMenu = null;
		else if (event.code === 'KeyT') settings.toggleTheme();
		// `L` — вибір locale; окремого меню мов більше немає, мова живе в налаштуваннях.
		else if (event.code === 'KeyL') openMenu = openMenu === 'settings' ? null : 'settings';
		else return;

		event.preventDefault();
	}

	/**
	 * The same page in another language. Built from the current pathname so the reader
	 * keeps their place instead of being dropped on the home page.
	 */
	function localeHref(locale: Locale): string {
		const pathname =
			base && page.url.pathname.startsWith(base)
				? page.url.pathname.slice(base.length)
				: page.url.pathname;

		return localePath(splitLocale(pathname).path, locale);
	}
</script>

<svelte:window onkeydown={handleShortcut} />

<div class="header__controls" class:header__controls--visible={visible}>
	<DropdownMenu
		label={t('settings.title')}
		keyshortcuts="T L"
		testId="settings"
		items={[
			...THEME_OPTIONS.map((theme) => ({
				id: `${THEME_PREFIX}${theme.id}`,
				label: t(theme.labelKey),
				group: t('settings.theme'),
				active: settings.theme === theme.id
			})),
			...STYLE_OPTIONS.map((style) => ({
				id: `${STYLE_PREFIX}${style.id}`,
				label: t(style.labelKey),
				group: t('settings.style'),
				active: settings.style === style.id
			})),
			...LOOK_OPTIONS.map((look) => ({
				id: `${LOOK_PREFIX}${look.key}`,
				label: t(look.labelKey),
				group: t('settings.look'),
				// `toggle` міняє роль пункта на `menuitemcheckbox`: увімкнений перемикач
				// і обрана тема інакше оголошувалися б читалці однаково.
				toggle: true,
				active: settings[look.key]
			})),
			...BEACON_OPTIONS.map((mode) => ({
				id: `${BEACON_PREFIX}${mode.id}`,
				label: t(mode.labelKey),
				group: t('settings.beacon'),
				active: settings.beacons === mode.id
			})),
			...LOCALE_OPTIONS.map((locale) => ({
				id: `${LANG_PREFIX}${locale.id}`,
				label: locale.label,
				group: t('settings.language'),
				href: localeHref(locale.id),
				hreflang: locale.id,
				active: settings.locale === locale.id
			}))
		]}
		open={openMenu === 'settings'}
		onToggle={(next) => (openMenu = next ? 'settings' : null)}
		onselect={(id) => {
			if (id.startsWith(THEME_PREFIX)) settings.setTheme(id.slice(THEME_PREFIX.length) as Theme);
			else if (id.startsWith(STYLE_PREFIX))
				settings.setStyle(id.slice(STYLE_PREFIX.length) as SiteStyle);
			else if (id.startsWith(LANG_PREFIX))
				settings.setLocale(id.slice(LANG_PREFIX.length) as Locale);
			else if (id.startsWith(BEACON_PREFIX)) {
				settings.setBeacons(id.slice(BEACON_PREFIX.length) as BeaconMode);
				return;
			} else if (id.startsWith(LOOK_PREFIX)) {
				settings.toggleLook(id.slice(LOOK_PREFIX.length) as LookKey);
				// Меню лишається відкритим: чотири перемикачі вмикають, дивлячись на
				// сторінку, і закриття після кожного означало б чотири відкривання
				// підряд, щоб порівняти.
				return;
			}
			openMenu = null;
		}}
		onPreview={(id) =>
			settings.previewTheme(
				id && id.startsWith(THEME_PREFIX) ? (id.slice(THEME_PREFIX.length) as Theme) : null
			)}
	>
		{#snippet trigger()}
			<Icon name="settings" size="1.2rem" />
		{/snippet}
		{#snippet itemVisual(item)}
			{#if item.id.startsWith(THEME_PREFIX)}
				<Icon
					name={THEME_OPTIONS.find((x) => `${THEME_PREFIX}${x.id}` === item.id)?.icon ?? 'moon'}
					size="1.1rem"
				/>
			{:else if item.id.startsWith(BEACON_PREFIX)}
				<Icon
					name={BEACON_OPTIONS.find((x) => `${BEACON_PREFIX}${x.id}` === item.id)?.icon ?? 'siren'}
					size="1.1rem"
				/>
			{:else if item.id.startsWith(LOOK_PREFIX)}
				<!--
					Позначка «увімкнено» — підсвітка пункта, як і скрізь у цьому меню; сама
					іконка називає, ЩО саме перемикають. Читалці стан каже `aria-checked`,
					а не колір.
				-->
				<Icon
					name={LOOK_OPTIONS.find((x) => `${LOOK_PREFIX}${x.key}` === item.id)?.icon ?? 'view'}
					size="1.1rem"
				/>
			{:else if item.id.startsWith(STYLE_PREFIX)}
				<Icon
					name={STYLE_OPTIONS.find((x) => `${STYLE_PREFIX}${x.id}` === item.id)?.icon ?? 'sparkles'}
					size="1.1rem"
				/>
			{:else}
				<span class="header__flags">
					{#each LOCALE_OPTIONS.find((l) => `${LANG_PREFIX}${l.id}` === item.id)?.flags ?? [] as flag (flag)}
						<img
							src={withBase(flag)}
							alt=""
							class="header__flag"
							width={FLAG_WIDTH}
							height={FLAG_HEIGHT}
						/>
					{/each}
				</span>
			{/if}
		{/snippet}
	</DropdownMenu>
</div>

<style>
	/*
	 * The three triggers take the same surface as every other control on the site.
	 *
	 * DropdownMenu gives them --glass-bg, which is translucent: over the header's
	 * blurred bar that reads as a button, and over the mobile panel's flat card colour
	 * it lands on almost the same value and they look like three bare glyphs. One rule
	 * for both places rather than a panel-only override, so there is nothing for the
	 * bundler to break a tie over (SVELTE-UI § 3.6).
	 *
	 * `.header__controls :global(.dropdown__trigger)` is (0,3,0) once Svelte adds its
	 * scoping class, against (0,2,0) for the component's own rule — it wins outright,
	 * not by being later.
	 */
	.header__controls :global(.dropdown__trigger) {
		background: var(--control-surface);
		border-color: transparent;
		-webkit-backdrop-filter: none;
		backdrop-filter: none;
	}

	.header__controls :global(.dropdown__trigger:hover) {
		background: var(--control-surface-hover);
	}

	/*
	 * And the panel that opens from them, for the same reason and in the same place.
	 *
	 * DropdownMenu paints itself --color-bg-card, which IS the header's colour on a wide
	 * screen: the menu opened over the bar and read as part of it rather than as a thing
	 * on top. In the mobile panel it had the same problem against the same value, and
	 * carried a fix of its own in HeaderNav — two rules for one intent, which is how the
	 * two places drift apart. There is exactly one dropdown in this project, and it lives
	 * here, so the rule lives here too.
	 *
	 * --control-surface-hover is the card colour stepped toward the text by a fixed
	 * amount, so the separation is identical in all four themes and can only ever be the
	 * same hue.
	 */
	.header__controls :global(.dropdown__menu) {
		background: var(--control-surface-hover);
		border: var(--border-width) solid var(--color-border);
	}

	/*
	 * ПРИХОВАНО ДО ЗАПУСКУ (рішення автора, 2026-09-13).
	 *
	 * Сайт відкривається в темній темі, виразному стилі й українською — і поки що
	 * лише так. Перемикачі нікуди не поділися: компонент малюється, гарячі клавіші
	 * `T` і `L` працюють, локатори на місці, тож повернути ряд — це прибрати
	 * `display: none` нижче.
	 *
	 * `display: none`, а не прозорість чи виніс за екран: обидва лишили б кнопки в
	 * черзі табуляції, і клавіатура водила б фокус по тому, чого не видно.
	 */
	.header__controls {
		display: none;
		align-items: center;
		gap: var(--space-xs);
		flex-shrink: 0;
	}

	.header__controls.header__controls--visible {
		display: flex;
	}

	/* Одна висота на всі три перемикачі, ту саму, що в пунктів і кнопки гарячої
	   лінії. DropdownMenu малює тригер під свій вміст, і три різні значки давали
	   три різні висоти. */
	.header__controls :global(.dropdown__trigger) {
		height: 44px;
	}

	.header__flags {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		flex-shrink: 0;
	}

	.header__flag {
		width: 20px;
		height: 14px;
		object-fit: cover;
		border-radius: 2px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
		display: block;
	}

	/*
	 * ПУНКТ ТЕМИ ПОКАЗУЄ СВОЮ ТЕМУ, а не поточну (THEME-SWITCHER § 4).
	 *
	 * Тло — `--color-bg-surface` тієї теми, тобто те, з чого зроблене саме це
	 * меню, а НЕ тло сторінки: тла сторінки не видно майже ніде, воно під
	 * фотографічним фоном, і кнопка, пофарбована ним, показує колір, якого
	 * відвідувач у тій темі не бачив жодного разу.
	 *
	 * Колір-ідентичність — смуга ліворуч у `--color-primary`. Саме primary, а не
	 * `--color-bg-card`: у світло-зеленої та зимової той `#ffffff`, тобто смуга
	 * була б невидима рівно там, де потрібна найбільше.
	 *
	 * Наведення не міняє тло: заливка кольором-ідентичністю провалює контраст
	 * (`#3f6b28` не дає читабельної пари ні з білим, ні з чорним). Замість неї
	 * рамка тим самим кольором — пара «текст на поверхні» лишається недоторканою.
	 *
	 * ## Прив'язка до самого меню, а не перелік ключів
	 *
	 * Доти тут стояв `:is()` із чотирма ключами тем, бо в списку не було
	 * локатора, а `data-menu-key` є на пунктах УСІХ трьох меню — без такого
	 * перелічування правило зачепило б і мову зі стилем. Локатор тепер є
	 * (`-menu`, як велить TESTID-AND-NAMING-v9 § типів), і селектор став
	 * простим та однозначним.
	 *
	 * Контраст «текст на поверхні» (WCAG AA): 9,08:1 (dark), 12,9:1
	 * (light-green), 12,6:1 (winter), 8,95:1 (orange-purple).
	 */
	:global([data-testid='theme-menu'] .dropdown__item) {
		border-left: 4px solid var(--sw-id);
	}

	:global([data-testid='theme-menu'] .dropdown__item:hover),
	:global([data-testid='theme-menu'] .dropdown__item:focus-visible) {
		box-shadow: inset 0 0 0 2px var(--sw-id);
	}

	/* Обраний лишається СВОЇХ кольорів — інакше обрана тема єдина перестала б
	   показувати себе. Вибір позначає суцільна рамка, а не заливка. */
	:global([data-testid='theme-menu'] .dropdown__item--active) {
		box-shadow: inset 0 0 0 3px var(--sw-id);
	}

	/* #2a3d1d, а не поверхня #242424: автор попросив оливкову — ту, якою темна
	   тема виглядає на ділі, а не нейтрально-сіру. */
	:global([data-testid='theme-menu'] .dropdown__item[data-menu-key='dark']) {
		--sw-id: #93bf4c;
		background: #2a3d1d;
		color: #e5e5e5;
	}

	:global([data-testid='theme-menu'] .dropdown__item[data-menu-key='light']) {
		--sw-id: #3f6b28;
		background: #e4ebd8;
		color: #262626;
	}

	/* #4a2e7a, а не поверхня #261742: та майже чорна, і фіолетового в ній не
	   видно — те саме зауваження, що й до темної. */
	:global([data-testid='theme-menu'] .dropdown__item[data-menu-key='orange-purple']) {
		--sw-id: #ff8c00;
		background: #4a2e7a;
		color: #f0e6ff;
	}
</style>
