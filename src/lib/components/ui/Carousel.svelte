<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import { copiesNeeded, rebaseBefore, wrapOffset } from '$lib/utils/carouselLoop';
	import { untabbable } from '$lib/utils/untabbable';
	import { t } from '$lib/i18n';

	interface Props {
		children: Snippet;
		speed?: number; // pixels per frame
		pauseOnHover?: boolean;
		testId?: string;
	}

	let { children, speed = 40, pauseOnHover = true, testId = 'ui-carousel' }: Props = $props();

	let viewport: HTMLElement;
	let content: HTMLElement;
	let unit: HTMLElement | undefined = $state();
	/** Ширина однієї копії з проміжком після неї. Решта арифметики — `carouselLoop`. */
	let unitWidth = $state(0);
	let copies = $state(2);
	/** Поки триває плавний рух від стрілки, перескок чекає: інакше він обірве його. */
	let smoothUntil = 0;
	let isInteracting = $state(false);
	let isDragging = false;
	let isMoved = false;
	let startX: number;
	let startScrollLeft: number;
	let autoScrollActive = $state(true);
	// The clone exists only to make the scroll seamless, so it is not worth doubling
	// the prerendered HTML for. It appears once the component is running in a browser.
	let mounted = $state(false);
	let animationFrame: number;
	let resumeTimeout: ReturnType<typeof setTimeout>;
	let lastTime: number = 0;
	let virtualScrollLeft: number = 0;
	let currentSpeed: number = 0;
	/**
	 * Which way it drifts on its own: 1 right, -1 left.
	 *
	 * Set from the last thing the visitor did. Someone scrolling back to a card they
	 * passed does not want the carousel pulling the other way the moment they let go.
	 */
	let direction = $state(1);

	const finalTestId = $derived(testId.endsWith('-container') ? testId : `${testId}-container`);

	function step(timestamp: number) {
		if (!lastTime) {
			lastTime = timestamp;
			animationFrame = requestAnimationFrame(step);
			return;
		}

		// Cap deltaTime to avoid jumps after tab backgrounding
		const deltaTime = Math.min(timestamp - lastTime, 64) / 1000;
		lastTime = timestamp;

		const targetSpeed = autoScrollActive && !isInteracting ? speed * direction : 0;

		// Modern exponential smoothing (lerp) for speed transitions
		// This provides a much more natural and "premium" feel than linear acceleration
		const lambda = 8.0; // Smoothing factor
		currentSpeed += (targetSpeed - currentSpeed) * (1 - Math.exp(-lambda * deltaTime));

		if (viewport) {
			if (!isInteracting && Math.abs(currentSpeed) > 0.1) {
				virtualScrollLeft += currentSpeed * deltaTime;

				// Та сама петля, що й у handleInfiniteJump: позиція живе в межах однієї копії.
				virtualScrollLeft = wrapOffset(virtualScrollLeft, unitWidth);

				viewport.scrollLeft = virtualScrollLeft;
			} else {
				/*
				 * Anything that is not us moving it: a drag, the wheel, the native scroll
				 * a trackpad produces, or simply standing still.
				 *
				 * This used to sync only `if (isInteracting)`, and interaction ends three
				 * seconds after the last event. Scroll the carousel by hand, wait, then take
				 * the pointer away, and the drift resumed from a position recorded before
				 * the scroll — the carousel jumped back to where it had been. There is one
				 * source of truth for where the track is, and it is the element.
				 */
				virtualScrollLeft = viewport.scrollLeft;
			}
		}
		animationFrame = requestAnimationFrame(step);
	}

	function measure() {
		if (!unit || !viewport || !content) return;
		const gap = parseFloat(getComputedStyle(content).columnGap) || 0;
		// Дробова ширина, а не offsetWidth: той округлює до цілого, і кожен перескок
		// зсував би стрічку на пів пікселя — за десяток обертів це вже тремтіння.
		const width = unit.getBoundingClientRect().width + gap;
		if (width <= 0) return;
		unitWidth = width;
		copies = copiesNeeded(viewport.clientWidth, width);
	}

	function handleInfiniteJump() {
		if (!viewport || unitWidth <= 0 || performance.now() < smoothUntil) return;

		const wrapped = wrapOffset(viewport.scrollLeft, unitWidth);
		if (Math.abs(wrapped - viewport.scrollLeft) < 1) return;

		viewport.scrollLeft = wrapped;
		virtualScrollLeft = wrapped;
	}

	function handleScroll() {
		// Not gated on isInteracting any more: a trackpad's two-finger swipe scrolls the
		// element natively and fires nothing else, so the wrap never happened and the
		// track ran off its own end.
		if (!autoScrollActive || isInteracting) {
			handleInfiniteJump();
		}
	}

	function handleWheel(e: WheelEvent) {
		if (!viewport) return;

		/*
		 * Which axis the wheel meant.
		 *
		 * Shift+wheel is the standard way to scroll sideways, and browsers disagree on
		 * how to report it: some swap the axes and send deltaX, some leave it in deltaY
		 * and set shiftKey. Reading whichever is non-zero covers both without asking
		 * which browser this is. Before, shift+wheel fell through to the native scroll,
		 * which moved the track without telling this component — so the drift resumed
		 * from its own stale idea of the position and undid it.
		 */
		const sideways = e.shiftKey ? e.deltaX || e.deltaY : e.deltaX;

		/*
		 * Звичайне коліщатко — це СТОРІНКА, а не стрічка.
		 *
		 * Тут стояло `sideways || e.deltaY`, тобто будь-яке прокручування над
		 * каруселлю перехоплювалося й рухало картки вбік, а сторінка стояла. Людина,
		 * яка просто гортала сторінку вниз і провела курсором над стрічкою,
		 * застрягала: сторінка не їде, замість неї чомусь їдуть картки. Стрічка
		 * тепер реагує лише на бічний намір — Shift+коліщатко або горизонтальний
		 * жест на тачпаді.
		 */
		if (!sideways) return;

		e.preventDefault();
		viewport.scrollLeft += sideways;
		// The drift picks up where the visitor left off, in the direction they went.
		direction = Math.sign(sideways);
		startInteraction();
		stopInteraction();
	}

	function handleMouseDown(e: MouseEvent) {
		if (!viewport) return;
		isDragging = true;
		// Cleared here as well as on release, so a value left behind by a gesture that
		// never ended cannot outlive the next press.
		isMoved = false;
		startX = e.pageX - viewport.offsetLeft;
		startScrollLeft = viewport.scrollLeft;
		startInteraction();
		viewport.style.cursor = 'grabbing';
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging || !viewport) return;
		e.preventDefault();
		const x = e.pageX - viewport.offsetLeft;
		const walk = (x - startX) * 1.5;
		if (Math.abs(x - startX) > 5) {
			isMoved = true;
			// Dragging content leftwards means moving forwards through it.
			direction = walk < 0 ? 1 : -1;
		}
		viewport.scrollLeft = startScrollLeft - walk;
	}

	function handleMouseUp() {
		if (!isDragging) return;
		isDragging = false;
		if (viewport) viewport.style.cursor = 'grab';
		stopInteraction();
		setTimeout(() => {
			isMoved = false;
		}, 50);
	}

	function startInteraction() {
		isInteracting = true;
		clearTimeout(resumeTimeout);
	}

	function stopInteraction() {
		resumeTimeout = setTimeout(() => {
			isInteracting = false;
		}, 3000); // Resume auto-scroll after 3 seconds of inactivity
	}

	function scrollBy(towards: number) {
		if (!viewport) return;
		startInteraction();
		direction = towards;
		const scrollAmount = viewport.clientWidth * 0.8 * towards;

		// Позиція зводиться ДО плавного руху, а не під час нього: перескок посеред
		// прокрутки обриває її на півдорозі — саме це й читається як «карусель глючить».
		if (unitWidth > 0) {
			const max = unitWidth * copies - viewport.clientWidth;
			const rebased = rebaseBefore(viewport.scrollLeft, scrollAmount, unitWidth, max);
			if (rebased !== null) {
				viewport.scrollLeft = rebased;
				virtualScrollLeft = rebased;
			}
			smoothUntil = performance.now() + 600;
		}

		viewport.scrollBy({ left: scrollAmount, behavior: 'smooth' });
		stopInteraction();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') scrollBy(-1);
		if (e.key === 'ArrowRight') scrollBy(1);
	}

	function handleClickCapture(e: MouseEvent) {
		if (isMoved) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	onMount(() => {
		mounted = true;

		const init = async () => {
			await tick();
			measure();
			// З нуля, а не з середини: позиція тепер живе в межах однієї копії, і назад
			// однаково можна — за лівим краєм стоїть попередня.
			if (viewport) {
				viewport.scrollLeft = 0;
				virtualScrollLeft = 0;
			}
		};
		init();

		// Ширина копії міняється від вікна (картки переносяться) і від вмісту.
		const observer = new ResizeObserver(measure);
		if (unit) observer.observe(unit);
		if (viewport) observer.observe(viewport);

		animationFrame = requestAnimationFrame(step);
		return () => {
			observer.disconnect();
			cancelAnimationFrame(animationFrame);
			clearTimeout(resumeTimeout);
		};
	});
</script>

<!--
	The release is heard on the window, not on the track.

	Press a card and drag, and the browser starts its own drag of the link or the image
	inside it — at which point mousemove and mouseup stop arriving here entirely. The
	track was told the gesture had begun and never told it had ended: isDragging stayed
	true, and isMoved with it, and isMoved is what the click handler below uses to swallow
	the click that ends a drag. So every click inside the carousel was cancelled from then
	on, for as long as the page was open. On the home page the carousel is most of the
	first screen, so the whole page looked frozen.

	Two fixes, because either alone leaves a hole: the window ends the gesture wherever the
	button is released, and dragstart is refused so the browser's own drag never takes the
	events away in the first place.
-->
<svelte:window onmouseup={handleMouseUp} onblur={handleMouseUp} />

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- Pointer and focus handlers pause auto-scroll (WCAG 2.2.2 Pause, Stop, Hide).
	 Arrow keys are handled here because keydown bubbles up from the nav buttons,
	 which are the keyboard entry point into the carousel. -->
<div
	class="carousel-root"
	role="region"
	aria-roledescription="carousel"
	aria-label={t('carousel.label')}
	data-testid={finalTestId}
	onmouseenter={() => pauseOnHover && (autoScrollActive = false)}
	onmouseleave={() => (autoScrollActive = true)}
	onfocusin={() => (autoScrollActive = false)}
	onfocusout={() => (autoScrollActive = true)}
	onkeydown={handleKeyDown}
	onclickcapture={handleClickCapture}
>
	<button
		class="nav-btn nav-btn--prev control-shape"
		onclick={() => scrollBy(-1)}
		aria-label={t('carousel.prev')}
		data-testid={`${testId}-prev-btn`}
	>
		<Icon name="arrow-left" size="1.5rem" />
	</button>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- Drag-to-scroll on a natively scrollable element: the pointer handlers add an
		 affordance, they are not the only way to reach the content (arrows, wheel,
		 native scrolling and the nav buttons all work). -->
	<div
		class="carousel-viewport"
		style="will-change: scroll-position"
		bind:this={viewport}
		onscroll={handleScroll}
		onwheel={handleWheel}
		ontouchstart={startInteraction}
		ontouchend={stopInteraction}
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
		ondragstart={(e) => e.preventDefault()}
	>
		<div class="carousel-track" bind:this={content}>
			<div class="carousel-content" bind:this={unit}>
				{@render children()}
			</div>
			<!-- Копії для безшовної петлі. Їх стільки, скільки треба, щоб за правим краєм
				 лишалася ще ціла — див. `unitWidth` угорі. Кожна прихована від читалок, тож
				 її посилання мусять вийти й із черги табуляції: aria-hidden навколо
				 фокусованого елемента — це порушення WCAG 4.1.2. Мишею вони клікаються. -->
			{#if mounted}
				{#each Array.from({ length: copies - 1 }, (_, i) => i) as i (i)}
					<div class="carousel-content" aria-hidden="true" {@attach untabbable}>
						{@render children()}
					</div>
				{/each}
			{/if}
		</div>
	</div>

	<button
		class="nav-btn nav-btn--next control-shape"
		onclick={() => scrollBy(1)}
		aria-label={t('carousel.next')}
		data-testid={`${testId}-next-btn`}
	>
		<Icon name="arrow-right" size="1.5rem" />
	</button>
</div>

<style>
	.carousel-root {
		position: relative;
		width: 100%;
		display: flex;
		align-items: center;

		/*
		 * How much room the cards' shadows get inside the scroller, above and below.
		 *
		 * `overflow-x: auto` cannot be paired with `overflow-y: visible` — the spec
		 * resolves the visible one to `auto` — so the track clips top and bottom whether
		 * it wants to or not, and the only room a shadow has is the padding around the
		 * cards. Sixteen pixels of it, and the shadow ended in a straight line across
		 * every card.
		 *
		 * These numbers are measured, not derived, and the derivation is why: a shadow's
		 * declared reach — offset plus blur plus spread — is not how far it paints. The
		 * blur is a Gaussian with a deviation of half the radius, so it keeps fading for
		 * about half the radius again beyond that. The hover shadow is `0 25px 50px -12px`
		 * and computes to 63px of reach; on screen, with a ruler against it, it is still
		 * visible at 90. A first attempt at this reserved 64 and looked fixed until you
		 * hovered a card.
		 *
		 * Uneven because the shadow falls downwards: below is where it needs the room.
		 */
		--shadow-room-top: 56px;
		--shadow-room-bottom: 96px;

		/*
		 * How far the scroller is allowed to stick out past the box that pauses the drift.
		 *
		 * The room above is bought with a negative margin, and a negative margin does not
		 * shrink the element — it only hides the growth from the layout. Whatever sticks
		 * out is still the scroller, still a descendant of the box whose mouseenter stops
		 * the carousel, so it is also dead space that stops the carousel for a pointer
		 * nowhere near a card. Taking back less than was reserved leaves the difference as
		 * ordinary spacing, which is the honest way to pay for the rest.
		 */
		--overhang-top: 24px;
		--overhang-bottom: 48px;
	}

	.carousel-viewport {
		overflow-x: auto;
		width: 100%;
		scrollbar-width: none;
		-ms-overflow-style: none;
		cursor: grab;
		/*
		 * Обидві осі, а не лише горизонтальна.
		 *
		 * `pan-x` означало «тут панорамують ТІЛЬКИ вбік», і вертикальний змах пальцем
		 * над стрічкою не робив нічого: сторінка під ним не їхала. Те саме, що й із
		 * коліщатком вище, тільки на дотику. З обома осями браузер сам обирає вісь за
		 * напрямком жесту — убік їде стрічка, униз сторінка.
		 */
		touch-action: pan-x pan-y;
		scroll-behavior: auto; /* Managed by JS for auto, smooth for buttons */
		/* Part of the room is taken back out of the layout; the rest stays as the gap
		   between the cards and what sits above and below them. See --overhang-* above. */
		margin-block: calc(var(--overhang-top) * -1) calc(var(--overhang-bottom) * -1);
	}

	.carousel-viewport::-webkit-scrollbar {
		display: none;
	}

	/*
	 * Проміжок між копіями — той самий, що між картками.
	 *
	 * Бічні відступи стояли на самій копії, тож на стику їх складалося два, і місце
	 * зшивання було видно як ширшу щілину. Тепер відстань одна на всіх.
	 */
	.carousel-track {
		display: flex;
		gap: var(--space-lg);
		width: max-content;
	}

	.carousel-content {
		display: flex;
		gap: var(--space-lg);
		padding: var(--shadow-room-top) 0 var(--shadow-room-bottom);
	}

	/*
	 * Стрілки видно завжди, а не лише під курсором.
	 *
	 * Так у дизайн-референсі: два кружки на краях стрічки стоять постійно, і це
	 * не оформлення — вони єдина видима ознака, що праворуч є ще картки. Поки
	 * вони з'являлися по `:hover`, стрічка на широкому екрані читалася як ряд
	 * карток, обрізаний з обох боків без причини (а на дотику ховер не настає
	 * ніколи, тож там їх не було взагалі — і саме тому на вузькому екрані вони
	 * сховані зовсім, а не показані марно).
	 *
	 * Колір — золотий, а не --color-primary: той у темній темі майже збігається з
	 * кольором картки під ним (1.3:1), і кнопка, яку показали, лишалася б
	 * невидимою.
	 */
	.nav-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 10;
		background: var(--color-bg-card);
		color: var(--color-accent);
		border: 1px solid var(--color-border);
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all var(--transition-normal);
		box-shadow: var(--shadow-md);
	}

	.nav-btn--prev {
		left: 10px;
	}
	.nav-btn--next {
		right: 10px;
	}

	.nav-btn:hover {
		background: var(--color-bg-card-hover);
		color: var(--color-accent);
		transform: translateY(-50%) scale(1.1);
		box-shadow: var(--shadow-lg);
	}

	@media (max-width: 768px) {
		.nav-btn {
			display: none;
		}
		.carousel-content {
			gap: var(--space-md);
			/* Only the sides go: the room above and below is what the shadows live in. */
			padding-inline: 0;
		}
	}

	:global([data-style='playful']) .nav-btn {
		box-shadow: var(--shadow-md);
	}
	:global([data-style='playful']) .nav-btn:active {
		transform: translateY(-50%) scale(0.95);
		box-shadow: var(--shadow-sm);
	}
</style>
