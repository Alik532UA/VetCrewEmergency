<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { Spring } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import { scrollbar } from '$lib/services/scrollbar.svelte';
	import { HoldScroll } from '$lib/utils/holdScroll.svelte';

	/** Thickness at rest and when the pointer comes near, px. */
	const REST_WIDTH = 10;
	const HOVER_WIDTH = 20;

	/** Smallest thumb height, so there is something to grab on a long page. */
	const MIN_THUMB = 32;

	let scrollY = $state(0);
	let viewportHeight = $state(0);
	let pageHeight = $state(1);
	let windowWidth = $state(0);
	let mouseX = $state(Number.POSITIVE_INFINITY);
	let pointerInside = $state(false);
	let dragging = $state(false);
	/** Offset of the grab point from the thumb's top, so it does not jump under the cursor. */
	let grabOffset = 0;
	/**
	 * The track's rectangle, taken ONCE when a drag starts.
	 *
	 * getBoundingClientRect() on every pointer move forces a layout, and the track is
	 * position: fixed — it does not move while the page scrolls anyway.
	 */
	let trackTop = 0;
	/** The element holding pointer capture, and for which pointer. */
	let capturedTrack: HTMLElement | null = null;
	let capturedPointerId = -1;
	/** Last pointer position, not yet applied. */
	let pendingY = 0;
	let frame = 0;

	/**
	 * Стала часу, з якою СТОРІНКА наздоганяє повзунок, ms.
	 *
	 * Повзунок лишається під курсором один до одного — керування від цього не
	 * страждає. А ось сторінка за ним більше не телепортується: на довгій сторінці
	 * передатне число смуги сягає 7 px сторінки на 1 px тяги, тож кожен рух руки
	 * кидав екран на сотні пікселів за кадр.
	 *
	 * 120 ms — це ~360 ms до повної зупинки: досить, щоб рух читався як ковзання,
	 * і замало, щоб смуга здавалася ватяною.
	 */
	const FOLLOW_TAU = 120;

	/** Куди сторінка їде. Повзунок там уже стоїть. */
	let scrollTarget = 0;
	let followFrame = 0;
	let followAt = 0;
	/** Скільки ми самі проскролили останнім кадром — щоб помітити чужий скрол. */
	let followApplied = 0;
	/**
	 * Сторінка ще доїжджає після відпускання.
	 *
	 * Повзунок увесь цей час лишається там, куди його притягли: інакше на відпусканні
	 * він стрибнув би назад до сторінки й поповз уперед разом з нею.
	 */
	let settling = $state(false);
	/**
	 * The thumb's position while dragging — straight from the cursor.
	 *
	 * Deriving it from the scroll state is a loop: move → scrollTo → scroll event →
	 * state → repaint. The thumb then trails the cursor by at least a frame, which
	 * reads as lag in the one interaction that has to feel direct.
	 */
	let dragThumbTop = $state(0);

	// Другий аргумент — функція, а не значення: чекбокс перемикають посеред сесії,
	// і запам'ятоване тут значення пережило б зміну.
	const hold = new HoldScroll(
		() => ({ markerTop: thumbTop, markerHeight: thumbHeight, pxPerScroll }),
		() => scrollbar.holdScroll
	);

	const reducedMotion = new MediaQuery('(prefers-reduced-motion: reduce)');

	/** Whether it is our turn to draw. One controller decides for all three. */
	const enabled = $derived(scrollbar.active === 'custom');

	const scrollable = $derived(pageHeight > viewportHeight + 1);
	/** MOUNTED while the mode is chosen; VISIBLE while there is something to scroll. */
	const visible = $derived(enabled && scrollable);

	const target = $derived.by(() => {
		if (!visible || reducedMotion.current) return 0;
		if (dragging) return 1;
		if (!pointerInside || !windowWidth) return 0;
		const start = 0.18 * windowWidth; // beyond this there is no reaction
		const end = 0.02 * windowWidth; // here it is already at maximum
		const distance = windowWidth - mouseX;
		if (distance > start) return 0;
		if (distance < end) return 1;
		return (start - distance) / (start - end);
	});

	const progress = new Spring(0, { stiffness: 0.05, damping: 0.4 });

	$effect(() => {
		progress.target = target;
	});

	/**
	 * Arrival and departure: 0 is fully past the edge, 1 is in place.
	 *
	 * Stiffer than the approach spring. Softness is not wanted here; what is wanted is
	 * to take the bar off a page that fits entirely, quickly and without wobbling.
	 */
	const presence = new Spring(0, { stiffness: 0.15, damping: 0.8 });

	$effect(() => {
		presence.target = visible ? 1 : 0;
	});

	/** What the thumb should occupy at the current page height. */
	const rawThumbHeight = $derived(
		Math.max((viewportHeight / pageHeight) * viewportHeight, MIN_THUMB)
	);

	/**
	 * The height is sprung because it jumped whenever the page height changed — a short
	 * page gives a long thumb and the other way round.
	 *
	 * The POSITION is deliberately not sprung: it has to follow the cursor and the
	 * scroll immediately, or the lag above comes back on purpose.
	 */
	const springHeight = new Spring(MIN_THUMB, { stiffness: 0.2, damping: 0.9 });

	$effect(() => {
		springHeight.target = rawThumbHeight;
	});

	const thumbHeight = $derived(springHeight.current);
	const width = $derived(REST_WIDTH + (HOVER_WIDTH - REST_WIDTH) * progress.current);
	const pxPerScroll = $derived(
		Math.max(viewportHeight - thumbHeight, 0) / Math.max(pageHeight - viewportHeight, 1)
	);

	const thumbTop = $derived.by(() => {
		if (dragging || settling) return dragThumbTop;
		const maxScroll = pageHeight - viewportHeight;
		if (maxScroll <= 0) return 0;
		return (scrollY / maxScroll) * (viewportHeight - thumbHeight);
	});

	function measure() {
		if (!browser) return;
		pageHeight = Math.max(document.documentElement.scrollHeight, 1);
		viewportHeight = window.innerHeight;
		scrollY = window.scrollY;
	}

	/**
	 * Measure straight after a navigation rather than waiting for the observer.
	 *
	 * It fires on its own too, a frame or two later — and that is exactly the moment
	 * the thumb would still be the previous page's height.
	 */
	afterNavigate(() => {
		if (enabled) measure();
	});

	$effect(() => {
		// Subscribed to the chosen mode, not to visibility: otherwise nobody would
		// notice a short page becoming a long one.
		if (!enabled) return;
		measure();

		const onScroll = () => (scrollY = window.scrollY);
		window.addEventListener('scroll', onScroll, { passive: true });

		// The page height changes for more reasons than a resize: card images arrive,
		// a filter empties the list, the carousel appears once it is shuffled.
		const observer = new ResizeObserver(measure);
		observer.observe(document.documentElement);

		return () => {
			window.removeEventListener('scroll', onScroll);
			observer.disconnect();
		};
	});

	/** The timer and the frames must not outlive the component. */
	$effect(() => () => {
		hold.stop();
		stopFollow();
	});

	/**
	 * Aim the page at where the thumb now is. The page gets there in `follow`.
	 */
	function applyScroll() {
		frame = 0;
		const maxThumbTop = viewportHeight - thumbHeight;
		if (maxThumbTop <= 0) return;
		const wanted = pendingY - trackTop - grabOffset;
		const clamped = Math.min(Math.max(wanted, 0), maxThumbTop);
		dragThumbTop = clamped;
		scrollTarget = (clamped / maxThumbTop) * (pageHeight - viewportHeight);

		// Під reduce ковзання не буває — лише результат.
		if (reducedMotion.current) {
			stopFollow();
			window.scrollTo({ top: scrollTarget, behavior: 'instant' });
			return;
		}

		if (!followFrame) {
			followAt = performance.now();
			followApplied = window.scrollY;
			settling = true;
			followFrame = requestAnimationFrame(follow);
		}
	}

	/**
	 * One frame of the page catching up with the thumb.
	 *
	 * behavior: 'instant', not 'auto'. 'auto' means "read CSS scroll-behavior", which is
	 * smooth here — every frame would start an animation and they would chase each
	 * other (SCROLLBAR-v8 § 9.2).
	 */
	function follow(now: number) {
		followFrame = 0;

		// Чужий скрол (коліщатко, клавіатура, якір) під час доїзду. Двоє водіїв на
		// одну сторінку смикали б її кожен до свого — поступаємося.
		if (Math.abs(window.scrollY - followApplied) > 2) {
			settling = false;
			return;
		}

		// Обмежено: вкладка, що повернулася з фону, дає один кадр завдовжки в
		// секунди, і сторінка доїхала б миттю саме там, де на це дивляться.
		const dt = Math.min(now - followAt, 100);
		followAt = now;

		const current = window.scrollY;
		const remaining = scrollTarget - current;

		/*
		 * Ціль — дробова (частка від висоти сторінки), а місце, куди браузер уміє
		 * поставити сторінку, — ні. Поріг у пів пікселя означав, що різниця в 0.6
		 * не зникала НІКОЛИ: крок від неї виходив менший за піксель, сторінка не
		 * рухалася, `remaining` лишався тим самим — і цикл крутився вічно.
		 *
		 * Вічний він був тихо, бо нічого не малював. Але щокадру видавав `scrollTo`,
		 * а кожен такий виклик СКАСОВУЄ чужу плавну анімацію — і кнопка «нагору»
		 * переставала працювати після будь-якої тяги смуги, назавжди до наступного
		 * миттєвого скролу.
		 */
		if (Math.abs(remaining) < 1) {
			window.scrollTo({ top: scrollTarget, behavior: 'instant' });
			followApplied = window.scrollY;
			settling = false;
			return;
		}

		// Експонента від ЧАСУ, а не частка кадру: інакше на 120 Гц сторінка доїжджає
		// вдвічі швидше, ніж на 60 — той самий рух руки дає різне відчуття на різних
		// екранах.
		const next = current + remaining * (1 - Math.exp(-dt / FOLLOW_TAU));
		window.scrollTo({ top: next, behavior: 'instant' });

		// Друга засувка, на випадок, якого перша не передбачила: сторінку попросили
		// зрушити, і вона не зрушила. Далі просити нема сенсу — чи то доїхали, чи то
		// впіймали край, і в обох випадках наступний кадр буде таким самим.
		if (window.scrollY === current) {
			followApplied = window.scrollY;
			settling = false;
			return;
		}

		followApplied = window.scrollY;
		followFrame = requestAnimationFrame(follow);
	}

	function stopFollow() {
		if (followFrame) {
			cancelAnimationFrame(followFrame);
			followFrame = 0;
		}
		settling = false;
	}

	/** Pointer moves arrive more often than frames — the extra ones are dropped. */
	function requestScroll(clientY: number) {
		pendingY = clientY;
		if (!frame) frame = requestAnimationFrame(applyScroll);
	}

	function onTrackPointerDown(e: PointerEvent) {
		// Suppresses the compatibility mouse events the browser starts a text selection
		// from. The track hugs the right edge of the window, which is where the browser's
		// own selection autoscroll takes over, and that then fights every scrollTo this
		// drag makes.
		e.preventDefault();

		const track = e.currentTarget as HTMLElement;
		trackTop = track.getBoundingClientRect().top;
		const localY = e.clientY - trackTop;

		// Pressing the thumb drags it from where it was taken. Pressing past it first
		// brings the thumb's CENTRE under the cursor.
		const onThumb = localY >= thumbTop && localY <= thumbTop + thumbHeight;
		grabOffset = onThumb ? localY - thumbTop : thumbHeight / 2;
		dragThumbTop = thumbTop;

		hold.stop();
		dragging = true;
		// Before the capture, so a throw there cannot swallow the opening jump.
		requestScroll(e.clientY);
		try {
			track.setPointerCapture(e.pointerId);
			capturedTrack = track;
			capturedPointerId = e.pointerId;
		} catch {
			// A 10px track loses the cursor to the slightest sideways drift, so the
			// gesture is really carried by the window listener below.
		}
	}

	function onTrackPointerMove(e: PointerEvent) {
		if (dragging) {
			requestScroll(e.clientY);
			return;
		}
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		hold.aim(e.clientY - rect.top);
	}

	function onTrackPointerEnter(e: PointerEvent) {
		if (dragging) return;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		hold.aim(e.clientY - rect.top);
	}

	/**
	 * Takes no event: it is called from the track and from the window, and capture has
	 * to come off the element that took it rather than the event's target.
	 */
	function endDrag() {
		if (!dragging) return;
		dragging = false;
		hold.stop();
		if (frame) {
			cancelAnimationFrame(frame);
			frame = 0;
		}
		if (capturedTrack !== null) {
			try {
				capturedTrack.releasePointerCapture(capturedPointerId);
			} catch {
				// Already released — by the browser, or with the element.
			}
			capturedTrack = null;
		}
	}
</script>

<svelte:window
	bind:innerWidth={windowWidth}
	onpointermove={(e) => {
		// While dragging this carries the gesture, and the width is already at maximum
		// so mouseX is left alone — a state update per move would cost a repaint for
		// nothing. The track is 10px wide: without this a drag survives only as long as
		// pointer capture holds and the cursor stays over it.
		if (dragging) {
			requestScroll(e.clientY);
			return;
		}
		mouseX = e.clientX;
		pointerInside = true;
	}}
	onpointerup={endDrag}
	onpointercancel={endDrag}
	onpointerleave={() => (pointerInside = false)}
/>

<!-- Mounted on `enabled`, not `visible`: a bar that left the DOM on a page with nothing
	 to scroll would have nothing left to animate away. -->
{#if enabled}
	<!--
		Says nothing, deliberately.

		It carried aria-label, which is prohibited on a bare div and which axe reports:
		an element with no role has nothing for a label to name. role="scrollbar" would
		be worse than the warning — that role owes a screen reader aria-controls and a
		live aria-valuenow, and what it would announce is a control nobody using one can
		reach, since there is nothing here to focus. The bar is a pointer convenience
		over scrolling, which works without it and stays on the keyboard either way.

		aria-hidden also settles what used to need a svelte-ignore here: a div nobody
		can see does not owe the compiler a role for its pointer handlers.
	-->
	<div
		class="page-scrollbar"
		class:dragging
		class:holding={hold.holding}
		class:page-scrollbar--hidden={presence.current < 0.01}
		style="width: {width}px; opacity: {presence.current};
			transform: translateX({(1 - presence.current) * width}px);"
		aria-hidden="true"
		data-testid="page-scrollbar-container"
		onpointerenter={onTrackPointerEnter}
		onpointerleave={() => hold.stop()}
		oncontextmenu={(e) => {
			e.preventDefault();
			hold.stop();
			scrollbar.openMenu(e.clientX, e.clientY);
		}}
		onpointerdown={onTrackPointerDown}
		onpointermove={onTrackPointerMove}
		onpointerup={endDrag}
		onpointercancel={endDrag}
	>
		<div
			class="page-scrollbar__thumb"
			style="top: {thumbTop}px; height: {thumbHeight}px;"
			data-testid="page-scrollbar-thumb-status"
		></div>
	</div>
{/if}

<style>
	.page-scrollbar {
		position: fixed;
		top: 0;
		right: 0;
		height: 100vh;
		/* Above the header (1000), below the log button (9999). */
		z-index: 1500;
		background: color-mix(in srgb, var(--scrollbar-track), transparent 40%);
		/* The shadow is not decoration: without it the overlay merges into the page,
		   because its background is nearly the same colour. A lighter or darker
		   background is only right in one theme; a shadow reads in all four. */
		box-shadow: -6px 0 18px rgba(0, 0, 0, 0.22);
		cursor: pointer;
		touch-action: none;
		/* Inherited by the thumb: a press on the track must not begin a text selection,
		   because the track hugs the window's right edge and that is where the browser's
		   own selection autoscroll lives. */
		user-select: none;
		-webkit-user-select: none;
	}

	/* Gone past the edge — takes no presses and is read by nothing. */
	.page-scrollbar--hidden {
		pointer-events: none;
		visibility: hidden;
	}

	.page-scrollbar__thumb {
		position: absolute;
		left: 2px;
		right: 2px;
		background: var(--scrollbar-thumb);
		border-radius: 999px;
		/* An indicator, not a target: the press has to reach the track, which is what
		   runs the gesture. Otherwise pressing the thumb and pressing beside it start on
		   different elements. */
		pointer-events: none;
		transition: background var(--transition-fast);
	}

	/*
	 * Під курсором повзунок ЯСКРАВІШАЄ, а не міняє колір.
	 *
	 * Тут стояв --color-primary, і виходило навпаки: у спокої повзунок акцентний і
	 * видимий, а варто піднести курсор — він ставав темно-зеленим і зливався з
	 * темою, тобто зникав рівно тоді, коли на нього дивляться. Той самий дефект, що
	 * й у кнопки налаштувань і кнопки «нагору»: первинний зелений опинявся на тлі
	 * власного відтінку.
	 *
	 * Той самий акцент, тільки без прозорості: у спокої він на чверть прозорий, щоб
	 * не сперечатися з текстом сторінки, під курсором — суцільний.
	 */
	.page-scrollbar:hover .page-scrollbar__thumb,
	.page-scrollbar.holding .page-scrollbar__thumb,
	.page-scrollbar.dragging .page-scrollbar__thumb {
		background: var(--color-accent);
	}

	@media print {
		.page-scrollbar {
			display: none;
		}
	}
</style>
