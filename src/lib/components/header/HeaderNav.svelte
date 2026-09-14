<script lang="ts">
	import HeaderControls from '$lib/components/header/HeaderControls.svelte';
	import HeaderMenuFooter from '$lib/components/header/HeaderMenuFooter.svelte';
	import HeaderNavLinks from '$lib/components/header/HeaderNavLinks.svelte';
	import HotlineButton from '$lib/components/emergency/HotlineButton.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { t } from '$lib/i18n';
	import { REPORT_URL } from '$lib/config';
	import { twinActions } from '$lib/utils/twinActions.svelte';

	/**
	 * One element in two shapes: a row of tabs across the bar, and the panel the burger
	 * unfolds on a phone. Everything below is about which of the two it is; what goes
	 * inside comes from the four components it composes.
	 */
	interface Props {
		/** Whether the burger has unfolded this into the full-screen panel. */
		open: boolean;
		/** Called on every link, so following one folds the panel away. */
		onNavigate: () => void;
	}

	let { open, onNavigate }: Props = $props();

	/**
	 * Шапка кричить лише тоді, коли більше нікому.
	 *
	 * Пару «подзвонити / написати» видно тричі за сторінку: тут, на першому екрані
	 * й у підвалі. Поки видно будь-яку з двох інших — ці стоять контуром, бо
	 * кричати над власною копією нема сенсу. Щойно обидві поїхали з екрана —
	 * заливка й маячок, бо тепер це єдиний номер на видноті.
	 */
	const loud = $derived(!twinActions.visible);
</script>

<!--
	Анімованої вкладки під активним пунктом більше немає.

	Вона була фігурою, що міряла ширину активного пункта, малювалася SVG-контуром і
	перетікала з розкльошеної в пілюлю за перші 120 пікселів прокручування. Автор
	попросив прибрати, і в дизайн-референсі такого стану справді немає: пункти там —
	самі слова, а поточний розділ підкреслено. Разом із нею пішли `HeaderTabWave`,
	`tabShape`, `TAB_HEIGHT` і одинадцять тестів на геометрію контуру; частка
	прокручування лишилася й переїхала в `utils/headerScroll.ts` — нею шапка
	проявляє власне тло.
-->
<nav class="header__nav" class:header__nav--open={open}>
	<HeaderNavLinks {onNavigate} />

	<HeaderControls />

	<!--
		Номер у самій смузі, як у дизайн-референсі.

		Це єдиний елемент шапки, заради якого сюди приходять у найгіршу мить, і
		він не має ховатися за бургер. На вузькому екрані смуга віддана бургеру,
		тож тут номер переїжджає нагору розгорнутої панелі — на два дотики
		замість одного. Гірше, ніж хотілося б, і краще за прокручування всієї
		сторінки до підвалу.
	-->
	<span class="header__actions">
		<HotlineButton compact testid="header-hotline-btn" beacon={loud} quiet={!loud} />
		<!--
			Друга дія пари — написати. Без підпису навмисно: у смузі поруч уже стоїть
			номер із трьох рядків, і другий підпис перетворив би кут шапки на текст.
			Назва в кнопки є, просто не намальована — `aria-label` віддає екранному
			читачеві те саме слово, що стоїть на великій кнопці першого екрана.
		-->
		<a
			class="header__write"
			class:header__write--quiet={!loud}
			class:header__write--beacon={loud}
			href={REPORT_URL}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={t('hero.report')}
			data-testid="header-write-btn"
		>
			<Icon name="telegram" size="1.25rem" />
		</a>
	</span>

	<HeaderMenuFooter {onNavigate} />
</nav>

<style>
	/* По центру, а не по нижньому краю. Низом пункти вирівнювалися заради вкладки:
	   вона стояла на основі смуги, і напис мусив стояти на ній же. Вкладки немає —
	   і різновисокі елементи ряду (логотип у три рядки, пункти, перемикачі,
	   червона кнопка) перестали висіти на спільній нижній лінії. */
	.header__nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex: 1;
		height: 72px;
		position: relative;
	}

	.header__actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.header__write {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		/* Рівно межа дотику цього проєкту, і рівно висота компактної кнопки поруч:
		   пара мусить читатися як одна смуга (`tests/touch-targets.spec.ts`). */
		width: 44px;
		height: 44px;
		border-radius: var(--radius-lg);
		/* Прозорий контур є завжди — з тієї ж причини, що й у кнопки поруч: поява
		   рамки в тихому вигляді інакше зсувала б смугу на чотири пікселі. */
		border: var(--border-width-soft) solid transparent;
		background: var(--color-tertiary);
		color: var(--color-text-on-tertiary);
		text-decoration: none;
		/* Секунда на зміну вигляду, звичні мілісекунди на наведення — див. той самий
		   прийом у `HotlineButton.svelte`. */
		transition:
			background-color 1s ease,
			border-color 1s ease,
			color 1s ease;
	}

	.header__write:hover {
		background: var(--color-tertiary-light);
		transition-duration: var(--transition-fast);
	}

	.header__write--quiet {
		border-color: var(--beacon-blue);
		background: transparent;
		color: var(--color-text);
	}

	/* Синій вогонь пари. Червоний бере кнопка поруч — розклад обох в одному циклі
	   (`@keyframes` в `app.css`). */
	.header__write--beacon {
		--beacon-glow: var(--beacon-blue);
		animation-name: beacon-b;
		animation-duration: calc(var(--beacon-flash) * 92);
		animation-timing-function: steps(1, end);
		animation-iteration-count: infinite;
	}

	@media (max-width: 768px) {
		.header__nav {
			display: none;
		}

		/* У розгорнутій панелі номер стоїть першим, попри те що в розмітці він
		   передостанній: у смузі його місце праворуч, а в стовпці — нагорі.
		   Обгортка своя, а не клас самої кнопки: той належить HotlineButton, і
		   правило, що спирається на чужу приватну назву, ламається мовчки. */
		.header__nav--open .header__actions {
			order: -1;
			display: flex;
		}

		/*
		 * The height is stated rather than left to `bottom: 0`.
		 *
		 * .header carries a backdrop-filter, and that makes it the containing block for
		 * everything fixed inside it. So `top: 72px; bottom: 0` was resolved against a box
		 * 72px tall: the panel came out 64px — its own padding and nothing else — while the
		 * five items overflowed onto the page with no background behind them. The menu
		 * looked transparent, and the rule that paints it was right all along.
		 */
		.header__nav--open {
			display: flex;
			position: fixed;
			top: 72px;
			left: 0;
			right: 0;
			height: calc(100dvh - 72px);
			overflow-y: auto;
			background: var(--color-bg-card);
			flex-direction: column;
			/* The row layout spreads its items across the bar; a column of five with the
			   same rule spreads them down a whole screen. They start at the top. */
			justify-content: flex-start;
			padding: var(--space-xl);
			align-items: stretch;
			gap: var(--space-sm);
		}

		/*
		 * While the accounts panel is open, the rest of the menu steps back.
		 *
		 * The panel opens over a screen full of links and controls, and everything
		 * competed with it for attention. Dimming rather than blurring: a backdrop would
		 * have to be a fixed element, and .header carries a backdrop-filter, which makes
		 * it the containing block for anything fixed inside — the overlay would cover the
		 * header and nothing else.
		 *
		 * :global around every class it reaches for, since all three belong to child
		 * components and Svelte would otherwise prune the rule as unused.
		 */
		.header__nav:has(:global(.org-logos--revealing)) :global(.header__link),
		.header__nav:has(:global(.org-logos--revealing)) :global(.header__controls),
		.header__nav:has(:global(.org-logos--revealing)) :global(.header__nav-projects) {
			opacity: 0.5;
			transition: opacity var(--transition-normal);
		}
	}
</style>
