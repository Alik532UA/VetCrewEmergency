import { expect, test, blockAnalytics } from './fixtures';

/**
 * Де шапка зустрічає сторінку.
 *
 * Врятовано з `tests/ui.spec.ts`, який приїхав копією з adoptananimal і майже весь
 * був про той проєкт: 89 із 95 його перевірок падали, бо шукали котів, собак,
 * форму заявки й мови `de`/`nl`. Шість, що проходили, — ці: вони про ЦЕЙ сайт, про
 * перший екран, фонову фотографію теми й тінь під смугою. Решту видалено.
 *
 * Перелік сторінок у першій перевірці теж замінено на справжні маршрути: там
 * стояли `/adopt/cat`, `/adopt/dog`, `/favorites`, `/apply`.
 */

test.describe('the header meets the page', () => {
	/** The colour of the section a page opens with. */
	const bandColour = (page: import('@playwright/test').Page) =>
		page.evaluate(() => getComputedStyle(document.querySelector('.main > *')!).backgroundColor);

	/*
	 * The tab half of this check is gone with the tab (2026-09-13).
	 *
	 * It compared the wave's fill to the band it sat in, because the two were one shape
	 * in one colour. There is no wave any more — the current section is marked with a
	 * flat rule under the label — so the only half left is that the opening section has
	 * a colour of its own at all, which is what `--color-band` is for.
	 */
	for (const path of ['/', '/library', '/stories', '/about', '/support']) {
		test(`the opening section has a colour of its own on ${path}`, async ({ page }) => {
			await page.goto(path);
			await page.waitForLoadState('networkidle');

			const band = await bandColour(page);
			expect(band, 'the opening section has no colour of its own').toMatch(/^rgba?\(/);
			expect(band, 'the opening section is transparent').not.toBe('rgba(0, 0, 0, 0)');
		});
	}

	/**
	 * The photograph the theme is built around is still visible, band or no band.
	 *
	 * It is the ground for everything below the opening section, and losing it is the way
	 * this rule goes wrong: an earlier attempt at that worry took the band off the home
	 * page altogether, which removed the wrong one of the two.
	 */
	test('the page still stands on the theme’s photograph', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const photograph = await page.evaluate(
			() => getComputedStyle(document.querySelector('.site-bg')!).backgroundImage
		);
		expect(photograph, 'nothing behind the page at all').toContain('.webp');
	});

	/*
	 * The photograph eases in over two seconds, the same as an animal's does.
	 *
	 * A CSS background has no load event, so this needs a real preload behind it, and
	 * the preload is where it went wrong the first time: in a build the custom property
	 * reads `url(./bg-….hash.webp)`, relative to the STYLESHEET, and resolving it
	 * against the document asked the site root for a file that is not there. The decode
	 * rejected, the reveal ran from the failure path instead of from the picture
	 * arriving, and it still looked correct — which is why this measures the ramp and
	 * the console rather than the final state.
	 */
	test('the theme’s photograph eases in rather than appearing at once', async ({ page }) => {
		const failed: string[] = [];
		page.on('response', (r) => {
			if (r.status() === 404 && /\.webp$/.test(r.url())) failed.push(r.url());
		});

		await page.goto('/');
		const layer = page.locator('.site-bg');

		await expect(layer).toHaveClass(/site-bg--loaded/, { timeout: 10_000 });
		expect(
			await layer.evaluate((el) => getComputedStyle(el).transitionDuration),
			'the fade is not two seconds long'
		).toBe('2s');

		// Caught mid-ramp: fully transparent or fully opaque would both pass a check on
		// the end state alone, and the defect was that it jumped straight to the end.
		const midway = await layer.evaluate(
			(el) =>
				new Promise<number>((resolve) =>
					setTimeout(() => resolve(Number(getComputedStyle(el).opacity)), 700)
				)
		);
		expect(midway, `not part-way through a fade — opacity was ${midway}`).toBeGreaterThan(0.05);
		expect(midway, `not part-way through a fade — opacity was ${midway}`).toBeLessThan(0.95);

		await expect
			.poll(async () => Number(await layer.evaluate((el) => getComputedStyle(el).opacity)), {
				timeout: 5000
			})
			.toBe(1);

		expect(failed, 'the preload asked for a file that is not there: ' + failed.join(', ')).toEqual(
			[]
		);
	});

	test('the photograph is there for a visitor without JavaScript', async ({ browser }) => {
		// The fade hides the layer behind [data-js], so a scripting failure must not be a
		// page with no background at all — the same guard AnimalCard.svelte needs.
		const context = await browser.newContext({ javaScriptEnabled: false });
		await blockAnalytics(context);
		const page = await context.newPage();
		await page.goto('/');

		const opacity = await page.evaluate(
			() => getComputedStyle(document.querySelector('.site-bg')!).opacity
		);
		expect(opacity, 'no script, no background — the layer never comes back').toBe('1');
		await context.close();
	});

	test('the colour runs to the end of the section, not to a fixed depth', async ({ page }) => {
		await page.goto('/');

		// It was a 120px band, which ended in the middle of the carousel and read as a
		// rendering fault. Whatever height the opening section is, the colour goes with it.
		const { section, painted } = await page.evaluate(() => {
			const first = document.querySelector('.main > *')!;
			const style = getComputedStyle(first);
			return {
				section: Math.round(first.getBoundingClientRect().height),
				painted: style.backgroundImage === 'none' ? 'full' : style.backgroundImage
			};
		});

		expect(section).toBeGreaterThan(300);
		expect(painted, 'the colour stops short of the section').toBe('full');
	});

	test('the shadow stays away until there is something to cast it on', async ({ page }) => {
		await page.goto('/');
		const opacity = () =>
			page.evaluate(() =>
				parseFloat(getComputedStyle(document.querySelector('.header')!, '::after').opacity)
			);

		// At the top the bar has no background of its own — the hero photograph runs
		// under it — and a shadow cast by nothing visible is a line from nowhere.
		expect(await opacity()).toBe(0);

		await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
		await page.waitForFunction(
			() => parseFloat(getComputedStyle(document.querySelector('.header')!, '::after').opacity) > 0
		);
		expect(await opacity()).toBe(1);
	});
});
