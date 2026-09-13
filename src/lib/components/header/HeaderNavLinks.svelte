<script lang="ts">
	import { localePath } from '$lib/utils/withBase';
	import { page } from '$app/state';
	import { t, type TranslationKey } from '$lib/i18n';
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { IconName } from '$lib/components/ui/icons';

	/**
	 * Every anchor in the header bar: the wordmark, the destinations, the call to action.
	 *
	 * They travel together because they are styled together — the wordmark and the call
	 * to action are both `.header__link` with a few declarations of their own on top, and
	 * separating any of them from that rule would leave it depending on a stylesheet in
	 * another file.
	 */
	interface Props {
		/** Called on every link, so following one folds the mobile panel away. */
		onNavigate: () => void;
	}

	let { onNavigate }: Props = $props();

	function isLinkActive(href: string): boolean {
		const target = localePath(href);
		if (href === '/') {
			return page.url.pathname === target;
		}
		return page.url.pathname.startsWith(target);
	}

	/**
	 * The icon travels with the item rather than being chosen in the markup.
	 *
	 * Adding a fifth destination is then one line here, and it cannot arrive without an
	 * icon — which is what happened to the four that already existed: the logo had a paw
	 * and the rest had nothing, so the row read as one button and four labels.
	 *
	 * A clipboard for the application: the plus already belongs to "order a website" in
	 * the footer, and this is a form to fill in rather than something to add.
	 */
	const navItems: { href: string; label: TranslationKey; icon: IconName }[] = [
		{ href: '/library', label: 'nav.library', icon: 'book' },
		{ href: '/stories', label: 'nav.stories', icon: 'heart' },
		{ href: '/about', label: 'nav.about', icon: 'paw' }
	];

	const isHomeActive = $derived(isLinkActive('/'));
</script>

<!-- `header__logo--active` розрізняє стан для правила кольору нижче. Підкреслення
	 воно не отримує: риска під назвою служби читається як помилка складання, а не як
	 «ви тут», та й «тут» для головної нічого не додає — на ній видно, де ти. -->
<a
	href={localePath('/')}
	class="header__link header__logo header__logo--nav"
	class:header__link--active={isHomeActive}
	class:header__logo--active={isHomeActive}
	aria-current={isHomeActive ? 'page' : undefined}
	onclick={onNavigate}
	data-testid="header-logo-link"
>
	<Icon name="paw" size="2.6rem" class="header__logo-icon" />
	<!--
		Логотип у три рядки, як у дизайн-референсі: назва, напрямок, повна назва
		служби. Рядки окремими елементами, а не одним рядком із переносами, бо в
		них різний кегль, накреслення й колір — «EMERGENCY» золотий і курсивом.

		Через словник, попри те що це латиниця в обох мовах: шаблон не тримає
		текстів (AGENTS.md), а ключі дають єдине місце, де назву правлять, якщо
		служба колись перейменується.
	-->
	<span class="header__logo-text">
		<span class="header__logo-brand">{t('brand.line1')}</span>
		<span class="header__logo-kind">{t('brand.line2')}</span>
		<span class="header__logo-full">{t('brand.line3')}</span>
	</span>
</a>

{#each navItems as item (item.href)}
	{@const active = isLinkActive(item.href)}
	<a
		href={localePath(item.href)}
		class="header__link"
		class:header__link--active={active}
		aria-current={active ? 'page' : undefined}
		onclick={onNavigate}
		data-testid="nav-{item.href.replaceAll('/', '-').replace(/^-|-$/g, '') || 'home'}-link"
	>
		<!-- Decorative: the label beside it is what names the link, and an icon
			 with a name of its own would have a screen reader say it twice. -->
		<Icon name={item.icon} size="1.05rem" class="header__link-icon" />
		<span class="header__link-label">{t(item.label)}</span>
	</a>
{/each}

<style>
	.header__logo {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		font-family: var(--font-accent);
		font-weight: 800;
		font-size: 1.25rem;
		color: var(--color-primary);
		text-decoration: none;
		/* Вище за пункти й вирівняне по центру смуги, а не по її низу: три рядки
		   логотипа просто не влізають у висоту рядкового пункта. */
		height: 56px;
		padding: 0 16px;
		position: relative;
		z-index: 2;
		transition: color 0.3s ease;
	}

	/*
	 * ЖОДНЕ ПИСЬМО В ШАПЦІ НЕ БЕРЕ --color-primary.
	 *
	 * Смуга шапки прозора вгорі сторінки, і під нею лежить перший розділ, пофарбований
	 * саме в --color-primary. Тобто напис цього кольору опиняється на тлі того самого
	 * кольору — заміряно 1.00:1, тобто не видно взагалі нічого. До того як шапка стала
	 * прозорою, це ховалося за її власним тлом і давало 1.34:1 — теж не текст, просто
	 * ніхто не дивився.
	 *
	 * Тому назва набрана кольором тексту (11.05:1 у темній темі, 13.61:1 у світлій), а
	 * наведення й активний стан — золотим (5.86:1 / 4.57:1). Обидва читаються і на
	 * смузі розділу, і на непрозорій шапці після прокручування.
	 */
	.header__logo {
		color: var(--color-text);
	}

	/*
	 * Три рядки в 48 пікселях смуги.
	 *
	 * Висоту задає не цей блок, а сама смуга (48px на вкладку, 72 на шапку), тож
	 * інтерліньяж тут щільний навмисно: 1.05 замість успадкованих 1.6, інакше
	 * лише перші два рядки й помістилися б. Кеглі підібрані під ту саму висоту, а
	 * не взяті з макета в його власному масштабі — референс намальовано вужчим за
	 * реальне вікно, і числа звідти тут читалися б удвічі більшими.
	 */
	.header__logo-text {
		display: flex;
		flex-direction: column;
		line-height: 1.05;
		text-transform: uppercase;
	}

	.header__logo-brand {
		font-size: 1.05rem;
		letter-spacing: 0.06em;
	}

	/* Золотий і курсивом — єдине місце в шапці, де палітра говорить «це саме
	   екстрена служба, а не лікарня й не притулок». Колір не успадковується від
	   стану вкладки: назва напрямку не змінює значення від того, на якій сторінці
	   стоїть відвідувач. */
	.header__logo-kind {
		font-size: 0.92rem;
		font-style: italic;
		letter-spacing: 0.06em;
		color: var(--color-accent);
	}

	.header__logo-full {
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.09em;
	}

	.header__logo--nav {
		display: inline-flex;
	}

	.header__logo:hover {
		color: var(--color-accent);
	}

	/*
	 * Активний стан — колір тексту теми, а не голий білий.
	 *
	 * Білий тут стояв від проєкту-джерела й міряний був лише проти темної теми.
	 * У світлій вкладка активного пункту — це `--color-primary` = #e8efe6, тобто
	 * білий напис на майже білій плашці: 1.17:1. Заміряно 2026-09-13; побачити це
	 * було нічим, бо на широкій смузі активна вкладка є на кожній сторінці, і в
	 * темній темі вона правильна.
	 *
	 * `--color-text` читається на плашці обох тем: 11.05:1 у темній, 13.61:1 у
	 * світлій. Правило мобільної панелі нижче лишається як було — там плашка інша,
	 * і її числа заміряні окремо (PROJECT-CONTEXT § 4.19).
	 */
	.header__logo--active {
		color: var(--color-text);
	}

	/* Поточний пункт теж мусить озватися на курсор. Раніше наведення лишало той
	   самий колір, тобто на головній сторінці назва була єдиним посиланням у шапці,
	   яке на курсор не реагувало ніяк. */
	.header__logo--active:hover {
		color: var(--color-accent);
	}

	.header__logo:hover :global(.header__logo-icon) {
		transform: scale(1.2) rotate(15deg);
	}

	.header__link {
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--color-text-muted);
		transition: color 0.3s ease;
		position: relative;
		/* 44 — мінімальна ціль дотику (`tests/touch-targets.spec.ts`), і водночас та
		   сама висота, що в перемикачів і кнопки гарячої лінії праворуч. Нижній
		   відступ у 8 пікселів пішов разом із вкладкою: він притискав напис до її
		   основи, а без неї лише збивав пункт із центру смуги. */
		height: 44px;
		padding: 0 16px;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		/* Between the glyph and its label. */
		gap: 8px;
		line-height: 1;
		z-index: 2;
	}

	.header__link :global(.header__link-icon) {
		/* Above the wave the active tab draws behind the item, like the label. */
		position: relative;
		z-index: 2;
		flex-shrink: 0;
	}

	/*
	 * У широкій смузі пункти — самі слова, без значків: так у дизайн-референсі.
	 *
	 * Сховано, а не викинуто з даних. У розгорнутій панелі на вузькому екрані
	 * значок працює — там пункт займає цілий рядок і око чіпляється саме за
	 * нього, — а референс описує лише широкий екран. Прибрати поле `icon` із
	 * `navItems` означало б забрати його й там.
	 *
	 * Єдиний значок, що лишився у правій частині смуги, — телефон у червоній кнопці
	 * гарячої лінії, і він належить не цьому файлу.
	 */
	@media (min-width: 769px) {
		.header__link :global(.header__link-icon) {
			display: none;
		}
	}

	/*
	 * Пункт смуги — один рядок, хай який довгий.
	 *
	 * «Що робити, якщо…» і «Збережені поради» переносилися на два рядки, і ряд
	 * ставав нерівним: сусідні пункти в один рядок, ці — у два, а вкладка під
	 * активним міряється по висоті пункта. У референсі всі пункти однорядкові.
	 *
	 * Місце під це звільнив прибраний заклик до дії; якщо пунктів колись стане
	 * більше, смуга має згорнутися в бургер раніше, а не почати їх ламати.
	 */
	.header__link-label {
		position: relative;
		z-index: 2;
		white-space: nowrap;
	}

	.header__link:hover {
		color: var(--color-accent);
	}

	.header__link--active {
		color: var(--color-text);
		background: transparent;
	}

	.header__link--active:hover {
		color: var(--color-accent);
		background: transparent;
	}

	/*
	 * Поточний розділ — рівна риска під написом.
	 *
	 * Замість фігури, що міняла форму від прокручування. Риска нерухома й нічого не
	 * міряє; ширину їй дає сам пункт. Це ще й форма, а не лише колір, тобто стан
	 * лишається помітним у відтінках сірого (WCAG 1.4.1) — чого сам по собі
	 * світліший напис не дає.
	 *
	 * `:not(.header__logo)` — не стилістична обережність, а виправлення: назва теж
	 * має клас `.header__link`, і на головній вона активна, тож риска лягала просто
	 * поперек рядка «WILDLIFE RESPONSE» і читалася як закреслення.
	 */
	.header__link--active:not(.header__logo)::after {
		content: '';
		position: absolute;
		right: 16px;
		bottom: 4px;
		left: 16px;
		height: 2px;
		border-radius: 2px;
		background: var(--color-accent);
	}

	/*
	 * У відкритій панелі два вигляди: звичайний рядок і поточна сторінка.
	 *
	 * Було три — третім був заклик до дії, обведений рядок «Повідомити про тварину».
	 * Він пішов зі смуги разом із дизайном шапки, а панель лише повторює її пункти.
	 *
	 * Кожен колір нижче заміряний, і саме заміри пояснюють те, що інакше виглядає
	 * кружним шляхом: чотири співвідношення й те, що кожне з них відкинуло, — у
	 * PROJECT-CONTEXT.md § 4.19.
	 */
	@media (max-width: 768px) {
		/* The bar keeps a wordmark of its own out here; this one goes with the nav. */
		.header__logo--nav {
			display: none;
		}

		.header__link {
			height: auto;
			padding: 12px 20px;
			border-radius: var(--radius-md);
			background: var(--control-surface);
			/* Not the bar's muted colour: that is 4.42:1 here in the dark theme. */
			color: var(--color-text);
		}

		/* `color` repeated on purpose: the white declared for this class further up ties
		   on specificity with `.header__link`, which now sets one and comes later. */
		.header__link--active {
			height: auto;
			align-self: auto;
			border-radius: var(--radius-md);
			background: var(--active-tab-bg);
			color: #ffffff;
			padding: 12px 20px;
		}

		/* The marker that survives greyscale — in two themes the current fill and a plain
		   row are the same lightness. An element, not an inset shadow: the pill's radius
		   clips a shadow into a crescent that reads as a rendering fault. */
		.header__link--active::after {
			content: '';
			position: absolute;
			left: 10px;
			top: 50%;
			width: 4px;
			height: 18px;
			border-radius: var(--radius-full);
			background: rgb(255 255 255 / 0.9);
			transform: translateY(-50%);
			z-index: 2;
		}
	}
</style>
