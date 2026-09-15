import { devices, expect, test, type Page, blockAnalytics } from './fixtures';

/**
 * The four scrollbar modes (SCROLLBAR-v8 § 11).
 *
 * Everything here needs a browser: the canon's static invariants — the duplicated
 * first-frame conditions, the single owner of the hiding class, the rules that keep a
 * drag from fighting itself — are checked from the source in
 * src/lib/services/scrollbar-canon.test.ts.
 */

const WIDE = { width: 1280, height: 800 };

/** Sets the stored mode and reloads, so the first-frame script runs with it. */
async function useMode(page: Page, mode: string) {
	await page.evaluate((m) => localStorage.setItem('vetcrewemergency_scrollbarMode', m), mode);
	await page.reload();
	await page.waitForLoadState('networkidle');
}

/** How much width the native bar is taking. 0 means it is hidden or an overlay. */
const nativeGap = (page: Page) =>
	page.evaluate(() => window.innerWidth - document.documentElement.clientWidth);

test.describe('the scrollbar modes', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize(WIDE);
		await page.goto('/');
	});

	test('the custom bar is what a visitor gets before they choose', async ({ page }) => {
		// The owner's default, and a departure from § 1 — recorded in PROJECT-CONTEXT.md
		// § 4.13. What § 1 actually protects is still true and is what this checks: the
		// native bar is never hidden with nothing in its place.
		await expect(page.locator('html')).toHaveClass(/has-custom-scrollbar/);
		await expect(page.getByTestId('page-scrollbar-container')).toBeVisible();
		await expect(page.getByTestId('minimap-container')).toHaveCount(0);
	});

	test('choosing the standard bar gives the native one back', async ({ page }) => {
		await useMode(page, 'standard');

		await expect(page.locator('html')).not.toHaveClass(/has-custom-scrollbar/);
		await expect(page.getByTestId('page-scrollbar-container')).toHaveCount(0);

		const width = await page.evaluate(
			() => getComputedStyle(document.documentElement).scrollbarWidth
		);
		expect(width, 'the native bar is hidden with nothing to replace it').not.toBe('none');
	});

	test('the custom bar replaces the native one and takes no width', async ({ page }) => {
		const before = await nativeGap(page);
		await useMode(page, 'custom');

		const bar = page.getByTestId('page-scrollbar-container');
		await expect(bar).toBeVisible();
		await expect(page.locator('html')).toHaveClass(/has-custom-scrollbar/);

		// The whole point of an overlay: the content is not narrower because the page
		// happens to scroll.
		expect(await nativeGap(page), 'the custom bar still leaves a gutter').toBe(0);
		expect(before).toBeGreaterThanOrEqual(0);

		const thumb = page.getByTestId('page-scrollbar-thumb-status');
		await expect(thumb).toBeVisible();
		const height = await thumb.evaluate((el) => el.getBoundingClientRect().height);
		// Proportional to the page, and never smaller than something you can grab.
		expect(height).toBeGreaterThanOrEqual(32);
		expect(height).toBeLessThan(800);
	});

	test('dragging the thumb scrolls the page', async ({ page }) => {
		await useMode(page, 'custom');
		await expect(page.getByTestId('page-scrollbar-container')).toBeVisible();

		const box = (await page.getByTestId('page-scrollbar-container').boundingBox())!;
		const x = box.x + box.width / 2;

		await page.mouse.move(x, 100);
		await page.mouse.down();
		await page.mouse.move(x, 500, { steps: 10 });
		await page.mouse.up();

		// The page glides to the thumb rather than teleporting under it, so it is still
		// arriving when the button comes up (SCROLLBAR-v8 § 9.2). Wait for it to stop
		// before reading — polling for "> 200" alone would pass on the first frame of
		// the glide and say nothing about where the drag actually ended.
		let previous = Number.NaN;
		await expect
			.poll(
				async () => {
					const y = await page.evaluate(() => window.scrollY);
					const still = y === previous;
					previous = y;
					return still;
				},
				{ timeout: 3000, intervals: [100] }
			)
			.toBe(true);

		const scrolled = await page.evaluate(() => window.scrollY);
		expect(scrolled, 'the drag moved nothing').toBeGreaterThan(200);

		// The thumb followed rather than staying where it was grabbed.
		const top = await page
			.getByTestId('page-scrollbar-thumb-status')
			.evaluate((el) => parseFloat((el as HTMLElement).style.top));
		expect(top).toBeGreaterThan(100);
	});

	test('a drag leaves nothing behind that kills the next smooth scroll', async ({ page }) => {
		/*
		 * Сторінка доїжджає за повзунком циклом `requestAnimationFrame`, і кожен його
		 * кадр видає `scrollTo`. Цикл, що не спинився, нічого не малює — але кожен
		 * такий виклик СКАСОВУЄ чужу плавну анімацію, і кнопка «нагору» після будь-якої
		 * тяги переставала повертати сторінку. Назавжди: миттєвий скрол її «лікував»,
		 * плавний — ні.
		 *
		 * Заміряно 2026-09-14: ціль доїзду дробова (частка від висоти сторінки), а
		 * місце, куди браузер уміє поставити сторінку, — ні; поріг у пів пікселя
		 * різниця в 0.6 не долала ніколи.
		 */
		await useMode(page, 'custom');
		const bar = page.getByTestId('page-scrollbar-container');
		await expect(bar).toBeVisible();

		const box = (await bar.boundingBox())!;
		const x = box.x + box.width / 2;
		await page.mouse.move(x, 100);
		await page.mouse.down();
		await page.mouse.move(x, 420, { steps: 10 });
		await page.mouse.up();

		// Доїзд закінчується сам; поки він триває, наступна перевірка нічого не значила б.
		let previous = Number.NaN;
		await expect
			.poll(
				async () => {
					const y = await page.evaluate(() => window.scrollY);
					const still = y === previous;
					previous = y;
					return still;
				},
				{ timeout: 3000, intervals: [100] }
			)
			.toBe(true);
		expect(await page.evaluate(() => window.scrollY), 'тяга нічого не зрушила').toBeGreaterThan(
			200
		);

		// Те саме, що робить кнопка «нагору» (`+layout.svelte`), і те саме, що ламалося.
		await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
		await expect
			.poll(async () => page.evaluate(() => window.scrollY), { timeout: 3000 })
			.toBeLessThan(5);
	});

	test('the schematic minimap draws the page as stripes', async ({ page }) => {
		await useMode(page, 'minimap');

		const strip = page.getByTestId('minimap-container');
		await expect(strip).toBeVisible();

		const width = await strip.evaluate((el) => el.getBoundingClientRect().width);
		expect(Math.round(width), 'the schematic strip is not 28px').toBe(28);

		// It starts below the header rather than at the top of the window: at this width
		// it would otherwise cover the theme and language controls.
		const { stripTop, headerBottom } = await page.evaluate(() => ({
			stripTop: document.querySelector('.minimap')!.getBoundingClientRect().top,
			headerBottom: document.querySelector('header')!.getBoundingClientRect().bottom
		}));
		expect(Math.round(stripTop)).toBe(Math.round(headerBottom));

		expect(await page.locator('.minimap__block').count(), 'no blocks drawn').toBeGreaterThan(3);
		await expect(page.getByTestId('minimap-viewport-status')).toBeVisible();
	});

	test('the visual minimap clones the page, inert and without duplicate ids', async ({ page }) => {
		await useMode(page, 'minimap-full');

		const strip = page.getByTestId('minimap-container');
		await expect(strip).toBeVisible();
		expect(Math.round(await strip.evaluate((el) => el.getBoundingClientRect().width))).toBe(180);

		const clone = page.locator('.minimap__clone > div');
		await expect(clone).toHaveAttribute('inert', '');
		await expect(clone).toHaveAttribute('aria-hidden', 'true');

		const inside = await page.evaluate(() => {
			const host = document.querySelector('.minimap__clone')!;
			return {
				children: host.querySelectorAll('*').length,
				ids: host.querySelectorAll('[id]').length,
				testids: host.querySelectorAll('[data-testid]').length,
				// A minimap inside the minimap would recurse on every rebuild.
				nested: host.querySelectorAll('.minimap, .page-scrollbar').length
			};
		});

		expect(inside.children, 'the clone is empty').toBeGreaterThan(20);
		expect(inside.ids, 'the clone kept ids, so every one on the page is now duplicated').toBe(0);
		expect(inside.testids, 'the clone kept test ids').toBe(0);
		expect(inside.nested, 'the minimap cloned itself').toBe(0);
	});

	test('dragging the minimap marker scrolls the page', async ({ page }) => {
		await useMode(page, 'minimap');
		await expect(page.getByTestId('minimap-container')).toBeVisible();

		// At rest the strip sits mostly past the right edge, leaving an 8px handle. Come
		// near it first, exactly as a person does, or the press lands outside the window.
		await page.mouse.move(WIDE.width - 4, 300);
		await page.waitForFunction(() => {
			const el = document.querySelector('.minimap') as HTMLElement;
			return el.getBoundingClientRect().right <= window.innerWidth + 0.5;
		});

		const box = (await page.getByTestId('minimap-container').boundingBox())!;
		const x = Math.min(box.x + box.width / 2, WIDE.width - 3);

		await page.mouse.move(x, box.y + 40);
		await page.mouse.down();
		await page.mouse.move(x, box.y + 400, { steps: 10 });
		await page.mouse.up();

		expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
	});

	test('a narrow window keeps the native bar even with a minimap chosen', async ({ page }) => {
		// Below 1100px a minimap would eat width the page needs. The choice is kept —
		// widening the window brings it back — but it does not draw.
		await useMode(page, 'minimap-full');
		await expect(page.getByTestId('minimap-container')).toBeVisible();

		await page.setViewportSize({ width: 900, height: 800 });
		await expect(page.getByTestId('minimap-container')).toHaveCount(0);
		await expect(page.locator('html')).not.toHaveClass(/has-custom-scrollbar/);

		await page.setViewportSize(WIDE);
		await expect(page.getByTestId('minimap-container')).toBeVisible();
	});

	test('the choice survives a reload, and the first frame already knows it', async ({ page }) => {
		await useMode(page, 'custom');
		await page.reload();

		// The class is set by the inline script before anything paints, not by hydration.
		// Set late, the native bar appears and then vanishes — the flicker the anti-FOUC
		// script exists to prevent, one feature over.
		await expect(page.locator('html')).toHaveClass(/has-custom-scrollbar/);
		await expect(page.getByTestId('page-scrollbar-container')).toBeVisible();
	});
});

test.describe('the scrollbar menu', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize(WIDE);
		await page.goto('/');
		// These exercise the hardest case: reaching the menu when the bar is the browser's
		// own and hands the page no events at all. The custom bar has its own contextmenu
		// handler and needs no trick, so it would test nothing here.
		await useMode(page, 'standard');
	});

	/** Right-click the strip at the right edge, where the native bar is drawn. */
	async function openOverNative(page: Page) {
		const { x, y } = await page.evaluate(() => ({
			x: document.documentElement.clientWidth - 6,
			y: Math.round(window.innerHeight / 2)
		}));
		await page.mouse.click(x, y, { button: 'right' });
	}

	test('opens on the native bar, where the browser gives the page no events', async ({ page }) => {
		// The native bar itself hands the page nothing, so the right click is judged by
		// coordinate instead. Covering it with a transparent element would work and would
		// also make the bar undraggable.
		await openOverNative(page);
		await expect(page.getByTestId('scrollbar-context-menu')).toBeVisible();

		for (const mode of ['standard', 'custom', 'minimap', 'minimap-full']) {
			await expect(page.getByTestId(`scrollbar-menu-${mode}-btn`)).toBeVisible();
		}

		// Mutually exclusive options, so a screen reader has to be told which is on. The
		// one that is on here is standard: this case only exists over the native bar, and
		// the beforeEach above asks for it by name.
		await expect(page.getByTestId('scrollbar-menu-standard-btn')).toHaveAttribute(
			'aria-checked',
			'true'
		);
		await expect(page.getByTestId('scrollbar-menu-custom-btn')).toHaveAttribute(
			'aria-checked',
			'false'
		);
	});

	test('switching mode from the menu takes effect and is remembered', async ({ page }) => {
		await openOverNative(page);
		await page.getByTestId('scrollbar-menu-minimap-btn').click();

		await expect(page.getByTestId('scrollbar-context-menu')).toHaveCount(0);
		await expect(page.getByTestId('minimap-container')).toBeVisible();

		expect(await page.evaluate(() => localStorage.getItem('vetcrewemergency_scrollbarMode'))).toBe(
			'minimap'
		);

		await page.reload();
		await expect(page.getByTestId('minimap-container')).toBeVisible();
	});

	test('closes on Escape and on a press outside', async ({ page }) => {
		await openOverNative(page);
		await expect(page.getByTestId('scrollbar-context-menu')).toBeVisible();
		await page.getByTestId('scrollbar-context-menu').press('Escape');
		await expect(page.getByTestId('scrollbar-context-menu')).toHaveCount(0);

		await openOverNative(page);
		await page.getByTestId('scrollbar-menu-backdrop').click({ position: { x: 20, y: 20 } });
		await expect(page.getByTestId('scrollbar-context-menu')).toHaveCount(0);
	});

	test('stays inside the window when opened at the bottom edge', async ({ page }) => {
		const { x, y } = await page.evaluate(() => ({
			x: document.documentElement.clientWidth - 6,
			y: window.innerHeight - 4
		}));
		await page.mouse.click(x, y, { button: 'right' });

		const menu = page.getByTestId('scrollbar-context-menu');
		await expect(menu).toBeVisible();

		const fits = await menu.evaluate((el) => {
			const r = el.getBoundingClientRect();
			return r.top >= 0 && r.left >= 0 && r.bottom <= window.innerHeight;
		});
		expect(fits, 'the menu opened partly off screen').toBe(true);
	});
});

/**
 * Хто саме магнітить (SNAP § 1).
 *
 * Магнітів два, і вони НЕ взаємозамінні: `scroll-snap-type` у CSS не знає, чим
 * сторінку зрушили, і доводить однаково тачпад, тягу смуги й PageDown. Доводчик у
 * JS дивиться на саму подію, тож бере лише коліщатко. Звідси розподіл — CSS лише
 * там, де подій `wheel` не буває взагалі.
 *
 * Перевіряється саме `defaultPrevented`: доводчик забирає жест собі рівно одним
 * способом — `preventDefault` на події. Дивитися на `scrollY` тут не можна, бо
 * синтетична подія нативного скролу не робить, і будь-яка цифра була б вигаданою.
 */
test.describe('магніт бере лише те, що йому належить', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize(WIDE);
		await page.goto('/');
	});

	/**
	 * Сайт живе під базовим шляхом (`svelte.config.js`, типово `/VetCrewEmergency`).
	 *
	 * `/` на нього перекидає сам, а `/library` — ні: це 404, і сторінка, де скрипт не
	 * виконується взагалі. Перша редакція цих тестів саме туди й била, тобто доводила
	 * «магніту немає» з геть іншої причини. Береться з самого перекидання, а не
	 * пишеться числом, щоб збірка з порожнім `BASE_PATH` теж працювала.
	 */
	async function siteRoot(page: Page): Promise<string> {
		await page.goto('/');
		return new URL(page.url()).pathname.replace(/\/$/, '');
	}

	/**
	 * Відкрити сторінку і дочекатися, поки КЛІЄНТ на ній ожив.
	 *
	 * `has-snap-scroll` вішає лише ефект у `+layout.svelte` — у першокадровому
	 * скрипті `app.html` його немає. Без цього очікування перевірка «доводчик жесту
	 * не взяв» проходила б і на негідрованій сторінці, де брати його нема кому.
	 */
	async function openHydrated(page: Page, path: string) {
		const response = await page.goto(path);
		expect(response?.status(), `${path} не відкрилася`).toBeLessThan(400);
		await expect(page.locator('html'), `${path} не ожила`).toHaveClass(/has-snap-scroll/);
	}

	/** Проганяє жест і каже, які його події доводчик забрав собі. */
	const gesture = (page: Page, deltas: number[], gapMs: number) =>
		page.evaluate(
			async ({ deltas, gapMs }) => {
				const taken: boolean[] = [];
				for (const deltaY of deltas) {
					const ev = new WheelEvent('wheel', {
						deltaY,
						deltaX: 0,
						deltaMode: 0,
						bubbles: true,
						cancelable: true
					});
					window.dispatchEvent(ev);
					taken.push(ev.defaultPrevented);
					await new Promise((r) => setTimeout(r, gapMs));
				}
				return taken;
			},
			{ deltas, gapMs }
		);

	test('на десктопі магнітить лише JS, і лише коліщатко', async ({ page }) => {
		await expect(page.locator('html')).toHaveClass(/has-snap-scroll/);

		// Магніт CSS тут мовчить — інакше він доводив би і тачпад, і тягу смуги.
		expect(
			await page.evaluate(() => getComputedStyle(document.documentElement).scrollSnapType),
			'CSS-магніт увімкнений там, де є тачпад'
		).toBe('none');

		// Щабель коліщатка: ціле, велике, без горизонталі, з паузою.
		expect(await gesture(page, [120], 300), 'доводчик не взяв щабель коліщатка').toEqual([true]);

		// Швидке прокручування — теж коліщатко, і теж його.
		expect(await gesture(page, [120, 120, 120], 40)).toEqual([true, true, true]);
	});

	test('на внутрішніх сторінках магніту немає взагалі', async ({ page }) => {
		// Головна зібрана з розділів, решта — суцільний текст: доводчик там притягував
		// до країв статті, тобто відбирав звичайний скрол заради зупинок, яких читач
		// не просив.
		//
		// Перевіряється і локалізований шлях: сайт живе під базовим шляхом, і перша
		// ручна перевірка цього правила міряла 404-сторінку, де скрипт не виконується
		// взагалі — «магніту немає» там було правдою з іншої причини. `page.goto`
		// нижче йде через baseURL і 404 дав би падіння на самому `goto`.
		const root = await siteRoot(page);

		// Спершу — що доводчик тут узагалі є: інакше «не магнітить» нижче нічого не
		// доводить, бо так само мовчала б сторінка зі зламаним скриптом.
		await openHydrated(page, `${root}/`);
		expect(await gesture(page, [120], 0), 'доводчика немає й на головній').toEqual([true]);

		for (const path of ['/library', '/stories', '/about', '/en/library']) {
			await openHydrated(page, root + path);
			expect(await gesture(page, [120], 0), `доводчик магнітить на ${path}`).toEqual([false]);
		}
	});

	test('головна магнітить у кожній мові', async ({ page }) => {
		const root = await siteRoot(page);

		for (const path of ['/', '/en']) {
			await openHydrated(page, root + path);
			expect(await gesture(page, [120], 0), `на ${path} магніту немає`).toEqual([true]);
		}
	});

	test('жест тачпада лишається у людини від початку й до кінця', async ({ page }) => {
		// Гідрація перевіряється явно з тієї ж причини, що й вище: очікування на
		// «жодної події не взято» справдилося б і на сторінці без живого скрипта.
		await expect(page.locator('html')).toHaveClass(/has-snap-scroll/);
		await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

		// Справжній ривок двома пальцями: розгін із нуля, дробові дельти на початку,
		// великі ЦІЛІ на піку — саме ті, що від щабля коліщатка не відрізнити.
		const taken = await gesture(page, [2.5, 6, 11.5, 24, 48, 96, 120, 100, 60, 24, 8, 2], 16);

		expect(
			taken.some(Boolean),
			`доводчик перехопив жест тачпада: ${taken.map((t) => (t ? 1 : 0)).join('')}`
		).toBe(false);
	});

	test('на сенсорному екрані магнітить CSS, бо wheel там не буває', async ({ browser }) => {
		const context = await browser.newContext({
			...devices['Pixel 7'],
			// Явно, а не з пресета: саме ця пара вмикає блок у base.css.
			hasTouch: true,
			isMobile: true
		});
		await blockAnalytics(context);
		const touch = await context.newPage();
		await touch.goto('/');
		await expect(touch.locator('html')).toHaveClass(/has-snap-scroll/);

		expect(
			await touch.evaluate(() => getComputedStyle(document.documentElement).scrollSnapType),
			'на сенсорному екрані не лишилося жодного магніту'
		).not.toBe('none');

		await context.close();
	});
});
