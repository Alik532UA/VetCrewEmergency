<script lang="ts">
	import { t } from '$lib/i18n';
	import { HOTLINE } from '$lib/config';
	import Icon from '$lib/components/ui/Icon.svelte';

	/**
	 * Кнопка гарячої лінії.
	 *
	 * Окремим компонентом, бо номер стоїть щонайменше у трьох місцях — шапка,
	 * перший екран, підвал, — і три копії розійдуться на першій же зміні номера.
	 * Саме це в чеклисті й перевіряється окремим пунктом.
	 *
	 * `tel:` без пробілів і дужок: у посиланні має бути номер, який набереться,
	 * а видиме написання — окремо, для людини.
	 */
	interface Props {
		/** Власний локатор кнопки, коли пункт чеклиста вказує саме на неї. */
		testid?: string;
		compact?: boolean;
		/**
		 * Червоний проблисковий маячок.
		 *
		 * Прапорцем, а не завжди: номер стоїть ще й у шапці та підвалі, а кнопка,
		 * що блимає в кожному рядку сторінки, — це вже не акцент, а тривога, від
		 * якої ховають вкладку. Світить лише пара на першому екрані.
		 */
		beacon?: boolean;
		/**
		 * Тихий вигляд: прозора заливка й кольоровий контур замість суцільної.
		 *
		 * Для шапки, і лише для неї: коли пару видно на самій сторінці, друга така
		 * сама кнопка вгорі змагається з нею за увагу, хоч веде туди ж.
		 */
		quiet?: boolean;
	}

	let { testid, compact = false, beacon = false, quiet = false }: Props = $props();
</script>

<a
	class="hotline"
	class:hotline--compact={compact}
	class:hotline--beacon={beacon}
	class:hotline--quiet={quiet}
	href="tel:{HOTLINE.tel}"
	data-testid={testid ?? 'hotline-btn'}
>
	<Icon name="phone" size={compact ? '1.25rem' : '1.4rem'} />
	<!--
		Порядок рядків різний, і це з референсу.

		У шапці зверху стоїть «ТЕРМІНОВА ЛІНІЯ 24/7», під ним номер: смуга вузька,
		і першим має читатися, ЩО це за номер. На першому екрані місця більше —
		там номер обрамлений з двох боків, зверху заклик, знизу та сама назва
		лінії, і найбільшим кеглем стоїть він сам.
	-->
	<span class="hotline__text">
		{#if compact}
			<small class="hotline__kind">{t('hotline.label')}</small>
			<strong>{HOTLINE.display}</strong>
		{:else}
			<small>{t('hotline.call')}</small>
			<strong>{HOTLINE.display}</strong>
			<small>{t('hotline.label')}</small>
		{/if}
	</span>
</a>

<style>
	.hotline {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.9rem 1.4rem;
		border-radius: var(--radius-lg);
		background: var(--color-secondary);
		color: var(--color-text-on-secondary);
		text-decoration: none;
		font-family: var(--font-accent);
		transition: background-color var(--transition-fast);
	}

	/*
	 * Зміна вигляду — секунда, наведення — як усюди.
	 *
	 * Обидва рухають `background-color`, тож одним оголошенням не обійтися: секунда
	 * на наведення читається як зависання. `:hover` перебиває тривалість, поки
	 * курсор на кнопці; коли він іде, правило перестає діяти, і кнопка гасне вже
	 * повільно — вхід швидкий, вихід м'який.
	 */
	.hotline--compact {
		transition:
			background-color 1s ease,
			border-color 1s ease,
			color 1s ease;
	}

	.hotline--compact:hover {
		transition-duration: var(--transition-fast);
	}

	/*
	 * Кнопка мусить озватися на курсор — раніше не озивалася зовсім.
	 *
	 * Світліший відтінок того самого червоного, а не яскравість чи тінь: `filter`
	 * зачепив би й білий напис усередині, а тінь на червоному блоці в темній темі
	 * майже не читається. Білий на `--color-secondary-light` — 9.39:1 у темній темі
	 * й 7.16:1 у світлій, тобто наведення нічого не коштує читомості.
	 */
	.hotline:hover {
		background: var(--color-secondary-light);
	}

	/* Червоний вогонь пари: шість позицій із десяти. Сині чотири бере кнопка
	   «повідомити» тією ж тривалістю й без затримки — розклад у них спільний
	   (`@keyframes` в `app.css`). */
	.hotline--beacon {
		--beacon-glow: color-mix(in srgb, var(--beacon-red), transparent var(--beacon-fade));
		/* Довгою формою, а не скороченням: `calc()` у скороченні `animation`
		   розбирають не всі рушії, і помилка там ковтає ВСІ інші її частини. */
		animation-name: beacon-a;
		animation-duration: calc(var(--beacon-flash) * 92);
		animation-timing-function: steps(1, end);
		animation-iteration-count: infinite;
	}

	/* Та сама висота, що в пунктів смуги й трьох перемикачів поруч: 44 пікселі.
	   Задана числом, а не відступами, бо всередині два рядки різного кегля — від
	   них висота виходила на кілька пікселів іншою, ніж у сусідів, і ряд читався
	   як складений нашвидкуруч. */
	.hotline--compact {
		height: 44px;
		padding: 0 1.1rem;
		gap: 0.65rem;
		/*
		 * Контур є завжди, просто здебільшого прозорий.
		 *
		 * Інакше поява контуру в тихому вигляді додавала б кнопці по два пікселі з
		 * кожного боку, і сусіди в смузі щосекунди ворушилися б. Лише в компактної,
		 * бо вигляд міняє тільки шапка — а взяти контур на всі означало б зрушити
		 * пару першого екрана відносно кнопки поруч, у якої його немає.
		 */
		border: var(--border-width-soft) solid transparent;
	}

	/*
	 * Тихий вигляд. Контур — світлим відтінком того ж червоного, тим самим, що
	 * світить маячок: темний `--color-secondary` на знімку першого екрана не
	 * видно зовсім, а напис лишається кольором смуги, де він читомий і на фото, і
	 * на власному тлі шапки.
	 */
	.hotline--quiet {
		border-color: var(--beacon-red);
		background: transparent;
		color: var(--color-text);
	}

	/* Назва лінії над номером набрана капітеллю з розрядкою — у референсі це
	   найдрібніший рядок у всій шапці, і саме розрядка не дає йому злитися в
	   пляму. */
	.hotline__kind {
		text-transform: uppercase;
		letter-spacing: 0.07em;
		font-weight: 700;
	}

	.hotline__text {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}

	.hotline__text strong {
		font-size: 1.15em;
		white-space: nowrap;
	}

	.hotline__text small {
		opacity: 0.85;
		font-size: 0.75em;
	}
</style>
