<script lang="ts">
	import { browser } from '$app/environment';
	import { acceptsShortcut } from '$lib/services/keyboard';
	import { settings } from '$lib/services/settings.svelte';
	import { toggleFullscreen } from '$lib/services/fullscreen';
	import VetCrewLogo from '$lib/components/VetCrewLogo.svelte';
	import ContactLinks from './ContactLinks.svelte';
	import HiddenPanel from './HiddenPanel.svelte';
	import ScrollIndicator from './ScrollIndicator.svelte';
	import { viewMode } from '$lib/controllers/viewMode.svelte';

	// 3 Scroll States (matching VetCrewHospital / VetCrewMain architecture):
	// 1: Centered logo, minimal buttons
	// 2: Bottom contact buttons expanded (DEFAULT STATE)
	// 3: Contact buttons shifted UP, and hidden bottom tools panel revealed
	let scrollState = $state<1 | 2 | 3>(2);
	let isDevPinned = $state(false);

	function stepScroll(direction: number) {
		if (direction > 0) {
			scrollState = scrollState === 3 ? 1 : ((scrollState + 1) as 1 | 2 | 3);
		} else {
			scrollState = scrollState === 1 ? 3 : ((scrollState - 1) as 1 | 2 | 3);
		}
	}

	function goToState(state: 1 | 2 | 3) {
		scrollState = state;
	}

	function handleLogoTap() {
		viewMode.recordTouchTap();
	}

	function toggleDevInfo() {
		if (scrollState !== 3) {
			scrollState = 3;
			isDevPinned = true;
		} else {
			isDevPinned = !isDevPinned;
		}
	}

	function isKey(e: KeyboardEvent, letter: string): boolean {
		return e.code === `Key${letter.toUpperCase()}` || e.key.toLowerCase() === letter.toLowerCase();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!acceptsShortcut(e)) return;

		if (e.code === 'Escape') {
			if (isDevPinned) {
				isDevPinned = false;
				return;
			}
			if (scrollState !== 1) {
				goToState(1);
			}
			return;
		}
		if (e.code === 'Digit1' || e.code === 'Numpad1') {
			goToState(1);
			return;
		}
		if (e.code === 'Digit2' || e.code === 'Numpad2') {
			goToState(2);
			return;
		}
		if (e.code === 'Digit3' || e.code === 'Numpad3') {
			goToState(3);
			return;
		}
		if (isKey(e, 'h')) {
			goToState(1);
			return;
		}
		if (isKey(e, 't')) {
			settings.toggleTheme();
			return;
		}
		if (isKey(e, 'l')) {
			settings.setLocale(settings.locale === 'uk' ? 'en' : 'uk');
			return;
		}
		if (isKey(e, 'f')) {
			toggleFullscreen();
			return;
		}
		if (isKey(e, 'i')) {
			toggleDevInfo();
			return;
		}
		if (e.code === 'Space' || e.code === 'ArrowDown' || e.code === 'PageDown') {
			e.preventDefault();
			stepScroll(1);
			return;
		}
		if (e.code === 'ArrowUp' || e.code === 'PageUp') {
			e.preventDefault();
			stepScroll(-1);
		}
	}

	$effect(() => {
		if (!browser) return;

		let wheelAccumulator = 0;
		let lastStepTime = 0;
		let wheelClearTimer: ReturnType<typeof setTimeout> | null = null;

		function handleWheel(e: WheelEvent) {
			e.preventDefault();
			const now = performance.now();
			wheelAccumulator += e.deltaY;

			if (wheelClearTimer) clearTimeout(wheelClearTimer);
			wheelClearTimer = setTimeout(() => {
				wheelAccumulator = 0;
			}, 140);

			const STEP_COOLDOWN = 55;
			const THRESHOLD = 40;

			if (Math.abs(wheelAccumulator) >= THRESHOLD && now - lastStepTime >= STEP_COOLDOWN) {
				stepScroll(wheelAccumulator > 0 ? 1 : -1);
				lastStepTime = now;
				wheelAccumulator = 0;
			}
		}

		let touchStartY = 0;
		function handleTouchStart(e: TouchEvent) {
			if (e.touches && e.touches[0]) {
				touchStartY = e.touches[0].clientY;
			}
		}

		function handleTouchEnd(e: TouchEvent) {
			if (e.changedTouches && e.changedTouches[0]) {
				const touchEndY = e.changedTouches[0].clientY;
				const deltaY = touchStartY - touchEndY;
				if (Math.abs(deltaY) > 42) {
					stepScroll(deltaY > 0 ? 1 : -1);
				}
			}
		}

		window.addEventListener('wheel', handleWheel, { passive: false });
		window.addEventListener('touchstart', handleTouchStart, { passive: true });
		window.addEventListener('touchend', handleTouchEnd, { passive: true });

		return () => {
			window.removeEventListener('wheel', handleWheel);
			window.removeEventListener('touchstart', handleTouchStart);
			window.removeEventListener('touchend', handleTouchEnd);
			if (wheelClearTimer) clearTimeout(wheelClearTimer);
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="page-container state-{scrollState}">
	<!-- Central Hero SVG Logo with dynamic cursor reactivity and 7-tap gesture -->
	<div
		class="hero-center state-{scrollState}"
		aria-label="Vet Crew"
		onclick={handleLogoTap}
		onkeydown={(e) => e.key === 'Enter' && handleLogoTap()}
		role="button"
		tabindex="0"
	>
		<VetCrewLogo />
	</div>

	<!-- Bottom Center Action Channels: Call, Telegram -->
	<ContactLinks isExpanded={scrollState === 2} isShiftedUp={scrollState === 3} />

	<!-- Hidden Actions Panel ONLY in State 3 (Theme, Lang, Dev Info, Fullscreen) -->
	<HiddenPanel isVisible={scrollState === 3} bind:isPinned={isDevPinned} />

	<!-- 3-State Cyclic Scroll Indicator on Right Edge -->
	<ScrollIndicator state={scrollState} onGoToState={goToState} />
</div>

<style>
	:global(.main:has(.page-container)) {
		padding-top: 0;
	}

	:global(.main:has(.page-container) > :first-child) {
		background-color: transparent;
	}

	.page-container {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		height: 100dvh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		user-select: none;
		-webkit-user-select: none;
		background:
			radial-gradient(circle at 50% 35%, rgba(89, 143, 58, 0.08), transparent 70%), var(--color-bg);
		color: var(--color-text);
		z-index: 50;
	}

	.hero-center {
		position: relative;
		z-index: 10;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
		cursor: pointer;
		outline: none;
	}

	/* State 1: Centered */
	.page-container.state-1 .hero-center {
		transform: translateY(0);
	}

	/* State 2: Lifted slightly */
	.page-container.state-2 .hero-center {
		transform: translateY(-28px);
	}

	/* State 3: Lifted more for the secondary tools panel */
	.page-container.state-3 .hero-center {
		transform: translateY(-56px);
	}

	@media (max-width: 640px) {
		.page-container.state-2 .hero-center {
			transform: translateY(-16px);
		}
		.page-container.state-3 .hero-center {
			transform: translateY(-38px);
		}
	}
</style>
