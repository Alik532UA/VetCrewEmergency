import { browser } from '$app/environment';
import { scrollbar } from '$lib/services/scrollbar.svelte';

/**
 * Плавний і повільний автодоводчик по розділах для коліщатка миші.
 *
 * Для коліщатка миші: один клік — один плавний перехід до наступного/попереднього
 * розділу за кривою ease-in-out, як гідравлічний доводчик дверей.
 * Для тачпада ноутбука та жестів: не перехоплюється, лишається звичайний вільний скрол.
 */

/**
 * Синус, а не куб: обидва стартують і спиняються з нульової швидкості, але куб
 * робить це НАДТО повільно з обох кінців. На типовому переході (розділ на весь
 * екран, 900 ms) куб за першу десяту секунди проходить 4 px — сторінка стоїть, і
 * читається це як затримка, а не як плавність. Синус на тій самій десятій дає
 * ~16 px: рух видно одразу. Середину він веде майже так само м'яко (пік — 1150
 * px/s проти 1100), а кінець так само доводить, а не кидає.
 */
export function easeInOutSine(x: number): number {
	return (1 - Math.cos(Math.PI * x)) / 2;
}

/**
 * Крива для кліка, що прийшов ПОСЕРЕД їзди (див. `smoothScrollTo`).
 *
 * ease-in-out починається з нульової швидкості. Перезапустити ним анімацію, поки
 * сторінка йде на повній швидкості, означає вбити швидкість у нуль і розігнати
 * заново — те саме сіпання, від якого доводчик і рятує. Ця крива стартує швидко
 * й гальмує в кінці, тож підхоплює рух там, де він є.
 */
export function easeOutCubic(x: number): number {
	return 1 - Math.pow(1 - x, 3);
}

export function isTrackpadEvent(e: { deltaMode: number; deltaX: number; deltaY: number }): boolean {
	if (e.deltaMode !== 0) return false;
	return Math.abs(e.deltaY) < 35 || Math.abs(e.deltaX) > 0 || !Number.isInteger(e.deltaY);
}

/**
 * Скільки часу дати дорозі завдовжки `distance` при висоті вікна `viewport`.
 *
 * Не стала: стала тривалість означає, що ДВА кліки поспіль проходять удвічі
 * довшу дорогу за той самий час — тобто вдвічі швидше, і доводчик перетворюється
 * на стрибок саме тоді, коли людина крутить коліщатко найактивніше. Корінь, а не
 * пряма пропорція, щоб довга дорога не тривала вічність: розділ на весь екран —
 * 900 ms, два розділи — 1270, а не 1800.
 */
export function snapDuration(distance: number, viewport: number): number {
	const ratio = Math.sqrt(Math.max(distance, 1) / Math.max(viewport, 1));
	return Math.min(1400, Math.max(450, Math.round(900 * ratio)));
}

export function initSnapScrollController(): () => void {
	if (!browser) return () => {};

	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

	let isAnimating = false;
	let animationId = 0;
	/** Куди їде поточна анімація. Точка відліку для наступного кліка коліщатка. */
	let targetY = 0;

	/**
	 * Магніт CSS на час їзди знято (`base.css`, `html.is-snap-animating`).
	 *
	 * `scroll-snap-type` діє й на програмний скрол: браузер доводить сторінку до
	 * своєї найближчої точки сам, посеред чужої анімації. Два доводчики на одну
	 * сторінку — це і є ривок у кінці переходу. Поки їде цей — CSS мовчить, а
	 * оскільки обидва рахують ту саму точку (`scroll-margin-top: 72px` проти
	 * `- 72` нижче), у кінці сторінка вже стоїть там, куди магніт її тягнув би.
	 */
	function setAnimating(on: boolean) {
		isAnimating = on;
		document.documentElement.classList.toggle('is-snap-animating', on);
	}

	function smoothScrollTo(destination: number) {
		const startY = window.scrollY;
		const diff = destination - startY;

		if (isAnimating) cancelAnimationFrame(animationId);

		if (Math.abs(diff) < 2) {
			setAnimating(false);
			return;
		}

		const ease = isAnimating ? easeOutCubic : easeInOutSine;
		const duration = snapDuration(Math.abs(diff), window.innerHeight);
		const startTime = performance.now();

		targetY = destination;
		setAnimating(true);

		function step(now: number) {
			const progress = Math.min((now - startTime) / duration, 1);

			// 'instant', а не двоаргументний `scrollTo(0, y)`: у html стоїть
			// scroll-behavior: smooth, і коротка форма читає саме його. Тоді кожен
			// кадр запускає ВЛАСНУ плавну анімацію браузера на 16 ms уперед, і
			// кожен наступний кадр її перецілює — сторінка стоїть близько
			// півсекунди, а потім долає весь розділ за три кадри. Обидві скарги —
			// «затримка» і «різко» — це один цей виклик.
			window.scrollTo({ top: Math.round(startY + diff * ease(progress)), behavior: 'instant' });

			if (progress < 1) {
				animationId = requestAnimationFrame(step);
			} else {
				setAnimating(false);
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

		// Механіка, а не лише показ: під reduce той самий перехід і має не їхати, а
		// статися. CSS тут уже вимикає `scroll-snap-type` — якби JS лишався, настройка
		// прибирала б слабший магніт і лишала сильніший.
		if (reduceMotion.matches) return;

		if (isTrackpadEvent(e)) return;

		// Поки їде — рахувати від того, КУДИ їде, а не де сторінка зараз. Інакше
		// другий клік коліщатка або нічого не робить (як було), або веде до тієї
		// самої точки, до якої вже їдемо: під час переходу коліщатко мертве.
		const from = isAnimating ? targetY : window.scrollY;
		const targets = getSnapTargets();

		const next =
			e.deltaY > 0
				? targets.find((t) => t > from + 25)
				: targets.filter((t) => t < from - 25).pop();

		if (next === undefined) {
			// Дороги далі немає. Якщо анімація йде — нативний скрол по цьому ж кліку
			// штовхав би сторінку проти неї.
			if (isAnimating) e.preventDefault();
			return;
		}

		e.preventDefault();
		smoothScrollTo(next);
	}

	window.addEventListener('wheel', onWheel, { passive: false });

	return () => {
		cancelAnimationFrame(animationId);
		setAnimating(false);
		window.removeEventListener('wheel', onWheel);
	};
}
