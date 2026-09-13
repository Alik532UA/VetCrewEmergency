import { browser } from '$app/environment';
import { scrollbar } from '$lib/services/scrollbar.svelte';

/**
 * Плавний і повільний автодоводчик по розділах для коліщатка миші.
 *
 * Для коліщатка миші: один клік — один плавний перехід до наступного/попереднього
 * розділу за кривою ease-in-out (~750ms), як плавний гідравлічний доводчик.
 * Для тачпада ноутбука та жестів: не перехоплюється, лишається звичайний вільний скрол.
 */
export function easeInOutCubic(x: number): number {
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function isTrackpadEvent(e: { deltaMode: number; deltaX: number; deltaY: number }): boolean {
	if (e.deltaMode !== 0) return false;
	return Math.abs(e.deltaY) < 35 || Math.abs(e.deltaX) > 0 || !Number.isInteger(e.deltaY);
}

export function initSnapScrollController(): () => void {
	if (!browser) return () => {};

	let isAnimating = false;
	let animationId = 0;

	function smoothScrollTo(targetY: number, duration = 900) {
		if (isAnimating) {
			cancelAnimationFrame(animationId);
		}
		isAnimating = true;

		const startY = window.scrollY;
		const diff = targetY - startY;
		if (Math.abs(diff) < 2) {
			isAnimating = false;
			return;
		}

		const startTime = performance.now();

		function step(now: number) {
			const elapsed = now - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = easeInOutCubic(progress);
			window.scrollTo(0, Math.round(startY + diff * eased));

			if (progress < 1) {
				animationId = requestAnimationFrame(step);
			} else {
				isAnimating = false;
			}
		}

		animationId = requestAnimationFrame(step);
	}

	function getSnapTargets(): number[] {
		const elements = document.querySelectorAll('.hero, .band, .page, .footer');
		const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
		const targets = new Set<number>();
		targets.add(0);

		elements.forEach((el) => {
			const htmlEl = el as HTMLElement;
			if (htmlEl.classList.contains('hero')) {
				targets.add(0);
			} else {
				const top = Math.round(htmlEl.getBoundingClientRect().top + window.scrollY - 72);
				if (top >= 0 && top <= maxScroll) {
					targets.add(top);
				}
			}
		});

		targets.add(maxScroll);
		return Array.from(targets).sort((a, b) => a - b);
	}

	function onWheel(e: WheelEvent) {
		if (!scrollbar.snapScroll) return;

		if (isTrackpadEvent(e)) {
			document.documentElement.classList.add('has-trackpad-scroll');
			return;
		}

		document.documentElement.classList.remove('has-trackpad-scroll');

		if (isAnimating) {
			e.preventDefault();
			return;
		}

		const currentY = window.scrollY;
		const targets = getSnapTargets();

		if (e.deltaY > 0) {
			const next = targets.find((t) => t > currentY + 25);
			if (next !== undefined) {
				e.preventDefault();
				smoothScrollTo(next, 900);
			}
		} else if (e.deltaY < 0) {
			const prev = targets.filter((t) => t < currentY - 25).pop();
			if (prev !== undefined) {
				e.preventDefault();
				smoothScrollTo(prev, 900);
			}
		}
	}

	window.addEventListener('wheel', onWheel, { passive: false });

	return () => {
		cancelAnimationFrame(animationId);
		window.removeEventListener('wheel', onWheel);
	};
}
