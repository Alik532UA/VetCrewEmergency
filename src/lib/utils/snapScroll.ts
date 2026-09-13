import { base } from '$app/paths';
import { browser } from '$app/environment';
import { LOCALES } from '$lib/i18n/locales';
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

/**
 * Тачпад це чи коліщатко — здогад, а не факт.
 *
 * Браузер джерела не каже: `WheelEvent` не має поля «звідки». Лишаються сліди, і
 * вони надійні лише в один бік — усе, що тут true, тачпадом майже напевно і є:
 *
 * - `deltaMode !== 0` — «рядки», а не пікселі. Так рахує лише коліщатко.
 * - дробове `deltaY` — тачпад міряє палець, коліщатко клацає цілими щаблями;
 * - `deltaX !== 0` — коліщатко вбік не возить;
 * - мале `deltaY` — щабель коліщатка в Chrome це 100 або 120, не 12.
 *
 * А в інший бік здогад дірявий: розігнаний ривок двома пальцями видає і цілі, і
 * великі `deltaY` з нульовим `deltaX` — від щабля не відрізнити. Саме ці події
 * ловить засувка в `initSnapScrollController`.
 */
export function isTrackpadEvent(e: { deltaMode: number; deltaX: number; deltaY: number }): boolean {
	if (e.deltaMode !== 0) return false;
	return Math.abs(e.deltaY) < 35 || Math.abs(e.deltaX) > 0 || !Number.isInteger(e.deltaY);
}

/**
 * Скільки тиші відділяє один жест тачпада від наступного, ms.
 *
 * Поки жест триває, події сиплються кожен кадр; пауза такої довжини означає, що
 * пальці зняли. Береться з запасом: між двома щаблями коліщатка буває і 60 ms,
 * а помилитися сюди безпечніше, ніж туди — зайво пропущений щабель це один
 * незроблений перехід, а зайво перехоплений жест це відібране керування.
 */
const GESTURE_GAP_MS = 400;

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

/**
 * Чи ми на головній — єдиній сторінці, зібраній із розділів.
 *
 * Решта сторінок це суцільний текст: бібліотека, історія, «про нас». Доводчик там
 * притягував до країв статті, тобто відбирав звичайний скрол заради зупинок, яких
 * читач не просив.
 *
 * Рахується з адреси на кожен клік, а не один раз на старті: SvelteKit не
 * перезавантажує сторінку, і запам'ятоване тут значення жило б до F5.
 */
export function isHomePath(pathname: string, basePath = ''): boolean {
	let path = pathname;
	if (basePath && path.startsWith(basePath)) path = path.slice(basePath.length);
	path = path.replace(/\/+$/, '');
	if (path === '') return true;
	return LOCALES.some((locale) => path === `/${locale}`);
}

/**
 * Скільки лишити над розділом, коли доводчик спиняється на ньому.
 *
 * Читається з CSS, а не зашито числом. Висота хедера живе в `base.css` як
 * `scroll-margin-top`, і розділи від неї відступають по-різному: `.band--tight`
 * навмисно без власного верхнього поля, тож без цього читання його вміст ставав
 * упритул до хедера, поки решта стояла з відступом.
 */
function snapMargin(el: HTMLElement): number {
	const declared = parseFloat(getComputedStyle(el).scrollMarginTop);
	return Number.isFinite(declared) ? declared : 0;
}

export function initSnapScrollController(): () => void {
	if (!browser) return () => {};

	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

	let isAnimating = false;
	let animationId = 0;
	/** Куди їде поточна анімація. Точка відліку для наступного кліка коліщатка. */
	let targetY = 0;

	/**
	 * Доки триває жест, впізнаний як тачпадний, коліщатко не слухаємо.
	 *
	 * Без цього довгий ривок двома пальцями перехоплюється посередині: перші події
	 * жесту дрібні й дробові, `isTrackpadEvent` їх упізнає, а на розгоні йдуть
	 * великі цілі — і доводчик забирає жест собі рівно тоді, коли людина розігналася.
	 * Засувка лише ПРОДОВЖУЄ впізнане: жест, який жодного тачпадного сліду не подав,
	 * її не вмикає, тож чисте коліщатко нею зачепити неможливо.
	 */
	let trackpadUntil = 0;

	function smoothScrollTo(destination: number) {
		const startY = window.scrollY;
		const diff = destination - startY;

		if (isAnimating) cancelAnimationFrame(animationId);

		if (Math.abs(diff) < 2) {
			isAnimating = false;
			return;
		}

		const ease = isAnimating ? easeOutCubic : easeInOutSine;
		const duration = snapDuration(Math.abs(diff), window.innerHeight);
		const startTime = performance.now();

		targetY = destination;
		isAnimating = true;

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
				const top = Math.round(
					htmlEl.getBoundingClientRect().top + window.scrollY - snapMargin(htmlEl)
				);
				if (top >= 0 && top <= maxScroll) {
					targets.add(top);
				}
			}
		});

		targets.add(maxScroll);
		return Array.from(targets).sort((a, b) => a - b);
	}

	/** Спільна умова для коліщатка й клавіатури. */
	function snapActive(): boolean {
		if (!scrollbar.snapScroll) return false;
		// Механіка, а не лише показ: під reduce той самий перехід і має не їхати, а
		// статися. CSS тут уже вимикає `scroll-snap-type` — якби JS лишався, настройка
		// прибирала б слабший магніт і лишала сильніший.
		if (reduceMotion.matches) return false;
		return isHomePath(location.pathname, base);
	}

	/** Крок до сусіднього розділу від того місця, куди сторінка ВЖЕ їде. */
	function stepTo(direction: 1 | -1): boolean {
		const from = isAnimating ? targetY : window.scrollY;
		const targets = getSnapTargets();
		const next =
			direction > 0
				? targets.find((t) => t > from + 25)
				: targets.filter((t) => t < from - 25).pop();
		if (next === undefined) return false;
		smoothScrollTo(next);
		return true;
	}

	function onWheel(e: WheelEvent) {
		if (!snapActive()) return;

		const now = e.timeStamp || performance.now();
		if (isTrackpadEvent(e)) {
			trackpadUntil = now + GESTURE_GAP_MS;
			return;
		}
		if (now < trackpadUntil) {
			// Той самий жест, що вже показав себе тачпадним. Засувку продовжуємо: до
			// кінця ривка події й далі приходитимуть щільно.
			trackpadUntil = now + GESTURE_GAP_MS;
			return;
		}

		// Поки їде — рахувати від того, КУДИ їде, а не де сторінка зараз (див. `stepTo`).
		// Інакше другий клік коліщатка або нічого не робить, або веде до тієї самої
		// точки, до якої вже їдемо: під час переходу коліщатко мертве.
		if (!stepTo(e.deltaY > 0 ? 1 : -1)) {
			// Дороги далі немає. Якщо анімація йде — нативний скрол по цьому ж кліку
			// штовхав би сторінку проти неї.
			if (isAnimating) e.preventDefault();
			return;
		}

		e.preventDefault();
	}

	/** Клавіші, що на головній ходять розділами, а не пікселями. */
	const STEPS: Record<string, 1 | -1> = {
		ArrowDown: 1,
		ArrowUp: -1,
		PageDown: 1,
		PageUp: -1,
		' ': 1
	};

	function onKeyDown(e: KeyboardEvent) {
		// Чуже вже оброблене: гарячі клавіші сайту, закриття меню, підказка браузера.
		if (e.defaultPrevented) return;
		// Ctrl+Home це «на початок», а Alt+← це історія — не наші.
		if (e.ctrlKey || e.metaKey || e.altKey) return;

		// Курсор у полі, у списку, що прокручується сам, чи в редагованому блоці:
		// там ті самі клавіші означають «рухай каретку», а не «гортай сторінку».
		const el = e.target as HTMLElement | null;
		if (el && el !== document.body) {
			const tag = el.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable) return;
			// Діалог чи меню поверх сторінки має свою навігацію стрілками.
			if (el.closest('[role="menu"], [role="listbox"], [role="dialog"], dialog[open]')) return;
		}

		if (!snapActive()) return;

		// Shift+Space це PageUp, і так було задовго до цього сайту.
		const key = e.key === ' ' && e.shiftKey ? 'PageUp' : e.key;
		const direction = STEPS[key];
		if (direction === undefined) return;
		// Shift зі стрілками виділяє текст, а не гортає.
		if (e.shiftKey && key !== 'PageUp' && key !== 'PageDown') return;

		if (stepTo(direction)) e.preventDefault();
	}

	window.addEventListener('wheel', onWheel, { passive: false });
	window.addEventListener('keydown', onKeyDown);

	return () => {
		cancelAnimationFrame(animationId);
		isAnimating = false;
		window.removeEventListener('wheel', onWheel);
		window.removeEventListener('keydown', onKeyDown);
	};
}
