import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { baselineFor, knownFor } from './a11y-baseline';

/**
 * axe over the built site. Contrast in particular cannot be checked by reading CSS:
 * the project ships four themes across three skins, and a pairing that fails only in
 * the theme nobody develops in is exactly the one that reaches users.
 */

// Дві теми й два стилі — рівно ті, що проєкт пропонує в меню. Перелік прийшов із
// adoptananimal, звідки копіювали цей файл, і називав чотири теми (`light-green`,
// `orange-purple`, `winter`), яких тут немає жодної: перевірка ходила по темах, що
// не існують, і падала на кожній.
//
// `minimal` лишився: він НЕ пропонується в меню (див. `menuOptions.ts`), але його
// таблиця стилів і токени цілі, і поставлений руками він застосовується. Саме тому
// його контраст варто міряти — інакше стиль, який можна ввімкнути, ніхто не
// перевіряв би взагалі.
const THEMES = ['dark', 'light'] as const;
const STYLES = ['modern', 'minimal', 'playful'] as const;
const PAGES = [
	'/',
	'/library',
	// Стаття, а не лише перелік: усередині інша розкладка — довгий текст, блоки
	// «чого не можна», червона картка з гарячою лінією в кінці.
	'/library/fawn',
	'/stories',
	'/stories/owl-broken-wing',
	'/about',
	'/support',
	// Кета сторінку з індексу прибрано, але не з перевірки: саме на ній
	// тестувальники проводять найбільше часу (BETA-CHECKLIST-v8 § 5.5).
	'/beta-test-checklists'
];

/**
 * Waits for every running animation on the element to finish.
 *
 * axe samples colours at the moment it runs, so a menu still fading in measures as a
 * blend of itself and what is behind it: white over green read as #d3ddcd and scored
 * 4.48 against a pair that actually passes at 6.28. Emulating reduced motion did not
 * settle it reliably; waiting on the animations themselves does.
 *
 * subtree: true, because what axe measures is the items inside the menu, not the menu
 * box. Without it this waited for the container to stop moving and then sampled
 * children that were still fading — which passed alone and failed under load, the
 * worst way for a check to be wrong.
 */
const settle = (locator: import('@playwright/test').Locator) =>
	locator.evaluate((el) =>
		Promise.all(el.getAnimations({ subtree: true }).map((a) => a.finished)).then(() => {})
	);

/**
 * The same wait, for everything on the page.
 *
 * networkidle says the requests finished, not that the page stopped moving, so the
 * whole-page audits were sampling colours mid-animation and had been getting away
 * with it. A link fading in over the page measured #4782d6 instead of the #1f66cc it
 * settles to and scored 3.68 against a pair that actually passes at 5.08.
 *
 * Endless animations are skipped: they never finish, and awaiting one would hang the
 * run rather than fail it. The timeout is the same reasoning applied to an animation
 * that is finite in theory and stuck in practice.
 */
const settlePage = (page: import('@playwright/test').Page) =>
	page.evaluate(
		() =>
			new Promise<void>((resolve) => {
				const finite = document
					.getAnimations()
					.filter((a) => (a.effect?.getComputedTiming().iterations ?? 1) !== Infinity);
				void Promise.all(finite.map((a) => a.finished.catch(() => undefined))).then(() =>
					resolve()
				);
				setTimeout(resolve, 3000);
			})
	);

/**
 * The one thing the owner has decided to keep at a contrast the audit would reject.
 *
 * Cards for animals that already found a home render at 50% opacity — greyscale read
 * as mourning for a happy outcome — and half-transparent text does not reach 4.5:1
 * whatever colours sit underneath. The trade is deliberate and bounded: they are at
 * most a tenth of the carousel, they are not the path to anything, and hovering or
 * focusing one brings it back to full opacity. PROJECT-CONTEXT.md § 4.11.
 *
 * It is written as an exclusion rather than a loosened threshold, so it is visible in
 * the diff the day that decision changes — and so nothing else drifts out of range
 * unnoticed in the meantime. The plated section title was on this list for one commit
 * and came off it: the colours it was excluded for have been replaced by ones that
 * measure.
 */
// Порожній, і це стан, а не забутий рядок: тут лежав `.animal-card--adopted` —
// клас adoptananimal, якого в цьому проєкті немає. Виняток для елемента, що не
// існує, нічого не пропускає, зате читається як «щось тут свідомо не міряють».
const OWNER_EXCEPTIONS: string[] = [];

/** Someone else's document: axe cannot audit across the origin boundary, and what is
 *  inside is not ours to fix. */
const NOT_OURS = 'iframe';

const audit = (page: import('@playwright/test').Page) =>
	new AxeBuilder({ page })
		.exclude(OWNER_EXCEPTIONS)
		.exclude(NOT_OURS)
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
		.analyze();

for (const path of PAGES) {
	test(`${path} has no accessibility violations`, async ({ page }) => {
		await page.goto(path);
		await page.waitForLoadState('networkidle');
		await settlePage(page);

		const results = await audit(page);

		/*
		 * Two assertions, not one, and the order matters.
		 *
		 * The ids first: a violation type we have never seen fails the run even if
		 * the total is still under the limit. A bare count would swallow it — one
		 * old violation fixed and one new one introduced nets to zero.
		 *
		 * Then the count, as a ceiling that only ever comes down. See
		 * ./a11y-baseline.ts for why this is not `toEqual([])`.
		 */
		const report = results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`).join('\n');

		const ids = [...new Set(results.violations.map((v) => v.id))].sort();
		expect(ids, `${path}: violation type that is not in the baseline\n${report}`).toEqual(
			knownFor(path)
		);

		expect(
			results.violations.length,
			`${path}: more violations than the baseline allows\n${report}`
		).toBeLessThanOrEqual(baselineFor(path));
	});
}

/*
 * The rules Lighthouse scores and the sweep above does not run.
 *
 * `audit()` asks for WCAG tags, which is the right default: those are the rules a
 * failure of which is a conformance failure. But Lighthouse's accessibility category
 * is NOT the WCAG tag set — it includes axe rules tagged `best-practice`, and their
 * weight counts against the 0.95 the deploy asserts.
 *
 * `heading-order` is one of them, and it cost a deploy. `/adopt/dog.html` scored 0.94:
 * the page's h1 sat directly above cards whose name was an h3, and the sweep above
 * could not see it because the rule never ran. Two audits with different scopes, and
 * the narrower one was read as complete — the same mistake as auditing one page and
 * calling it the site.
 *
 * Added rule by rule rather than by turning on the whole `best-practice` tag: that
 * would drag in a dozen unrelated rules at once, and a gate that arrives red is a gate
 * that gets switched off (ACCESSIBILITY § 10.1.1). Each id here is one Lighthouse
 * weighs, checked on every page, at zero tolerance because that is where it starts.
 */
const LIGHTHOUSE_EXTRA_RULES = ['heading-order'];

for (const path of PAGES) {
	test(`${path} keeps the heading levels Lighthouse also scores`, async ({ page }) => {
		await page.goto(path);
		await page.waitForLoadState('networkidle');

		const results = await new AxeBuilder({ page })
			.exclude(NOT_OURS)
			.withRules(LIGHTHOUSE_EXTRA_RULES)
			.analyze();

		const report = results.violations
			.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')}`))
			.join('\n');

		expect(results.violations, `${path}: Lighthouse counts this against 0.95\n${report}`).toEqual(
			[]
		);
	});
}

/*
 * Every theme on every page, not one theme on one page.
 *
 * This used to audit /adopt/cat alone, which is the same blind spot the note at the
 * top of this file describes, only one level up: the pairing that fails is the one on
 * the page nobody thought to check in the theme nobody develops in. It missed a
 * secondary button that measures 2.89:1 in winter and 5.98:1 in the default, and it
 * missed it because the page it sits on was only ever audited in the default.
 */
for (const theme of THEMES) {
	for (const path of PAGES) {
		test(`theme ${theme} keeps contrast within WCAG AA on ${path}`, async ({ page }) => {
			await page.goto(path);
			await page.evaluate((t) => {
				localStorage.setItem('vetcrewemergency_theme', t);
			}, theme);
			await page.reload();
			await page.waitForLoadState('networkidle');
			await settlePage(page);

			expect(await page.getAttribute('html', 'data-theme')).toBe(theme);

			const results = await new AxeBuilder({ page })
				.exclude(OWNER_EXCEPTIONS)
				.exclude(NOT_OURS)
				.withTags(['wcag2aa'])
				.analyze();
			const contrast = results.violations.filter((v) => v.id === 'color-contrast');

			expect(
				contrast.flatMap((v) =>
					v.nodes.map((n) => `${theme} ${path}: ${n.target} — ${n.failureSummary}`)
				)
			).toEqual([]);
		});
	}
}

/*
 * Every skin as well, not only every theme.
 *
 * The same blind spot one step along. The sweep above varies the theme and leaves the
 * skin wherever it was, so a rule that exists in one skin alone was never measured at
 * all: playful puts the section title on a plate of --color-secondary and took the
 * foreground meant for --color-primary. That reads as deliberate in the three themes
 * whose secondary is a light amber, and it came out at 1.71:1 — dark purple on dark
 * purple — in the one whose secondary is not.
 *
 * The home page alone, because it carries both of the things a skin repaints, the
 * plated title and the badges on the cards; three skins over six pages is a sweep
 * nobody would keep waiting for.
 */
for (const style of STYLES) {
	for (const theme of THEMES) {
		test(`style ${style} keeps contrast within WCAG AA in theme ${theme}`, async ({ page }) => {
			await page.goto('/');
			await page.evaluate(
				([s, t]) => {
					localStorage.setItem('vetcrewemergency_style', s);
					localStorage.setItem('vetcrewemergency_theme', t);
				},
				[style, theme] as const
			);
			await page.reload();
			await page.waitForLoadState('networkidle');
			await settlePage(page);

			// Both, because a skin that failed to apply would leave the default one in
			// place and the audit would quietly pass on a page it never tested.
			expect(await page.getAttribute('html', 'data-style')).toBe(style);
			expect(await page.getAttribute('html', 'data-theme')).toBe(theme);

			const results = await new AxeBuilder({ page })
				.exclude(OWNER_EXCEPTIONS)
				.exclude(NOT_OURS)
				.withTags(['wcag2aa'])
				.analyze();

			expect(
				results.violations
					.filter((v) => v.id === 'color-contrast')
					.flatMap((v) =>
						v.nodes.map((n) => `${style}/${theme}: ${n.target} — ${n.failureSummary}`)
					)
			).toEqual([]);
		});
	}
}

test('the skip link reaches this page, not the home page', async ({ page }) => {
	// Будь-яка сторінка, КРІМ головної: у цьому й перевірка — посилання «до вмісту»
	// мусить вести на цю сторінку, а не відкидати на головну.
	await page.goto('/library');

	await page.keyboard.press('Tab');
	const skip = page.locator('.skip-link');
	await expect(skip).toBeFocused();

	await page.keyboard.press('Enter');
	// It must stay on the same page — the bug it replaced sent keyboard users home.
	await expect(page).toHaveURL(/\/library(#main-content)?$/);
});

test('the language pages declare their own language', async ({ page }) => {
	for (const [path, lang] of [
		['/', 'en'],
		['/', 'uk'],
		['/library', 'uk'],
		['/en', 'en'],
		['/en/library', 'en']
	] as const) {
		await page.goto(path);
		expect(await page.getAttribute('html', 'lang')).toBe(lang);
	}
});

for (const theme of THEMES) {
	test(`the open menus pass contrast in theme ${theme}`, async ({ page }) => {
		// A closed menu has nothing to measure, so axe over the page as loaded said
		// nothing about it. The active item paired --color-primary with a literal
		// white, which is 2.14:1 on the dark theme's green.
		await page.goto('/');
		await page.evaluate((t) => localStorage.setItem('vetcrewemergency_theme', t), theme);
		await page.reload();

		for (const menu of ['theme', 'style', 'lang']) {
			await page.getByTestId(`${menu}-toggle-btn`).click();
			await expect(page.getByRole('menu')).toBeVisible();
			await settle(page.getByRole('menu'));

			const results = await new AxeBuilder({ page })
				.include('[role="menu"]')
				.withTags(['wcag2aa'])
				.analyze();

			expect(
				results.violations.flatMap((v) =>
					v.nodes.map((n) => `${theme}/${menu}: ${v.id} ${n.target}`)
				)
			).toEqual([]);

			await page.keyboard.press('Escape');
		}
	});
}

test('a dropdown can be operated and left with the keyboard alone', async ({ page }) => {
	/*
	 * Ряд перемикачів у шапці схований до запуску сайту (`HeaderControls.svelte`) і
	 * відкривається службовим жестом — сім натисків `H`. Прапорець ставиться напряму:
	 * перевіряється клавіатурна поведінка МЕНЮ, і сім зайвих подій зробили б падіння
	 * цього тесту неоднозначним.
	 */
	await page.addInitScript(() => {
		try {
			sessionStorage.setItem('vetcrewemergency_header_controls_visible', '1');
		} catch {
			/* приватний режим — перевірка нижче скаже, що меню не відкрилося */
		}
	});

	await page.goto('/');

	// Одне меню на п'ять груп (тема, стиль, вигляд, маячки, мова) — відколи кнопки
	// шапки зійшлися під кнопку «Налаштування». Перевіряється тут не вміст, а
	// поведінка клавіатури.
	await page.getByTestId('settings-toggle-btn').click();
	// Focus moves into the menu, so the arrow keys have somewhere to start. First in the
	// list is the theme the site opens in.
	await expect(page.getByTestId('settings-option-theme-dark-btn')).toBeFocused();

	await page.keyboard.press('ArrowDown');
	await expect(page.getByTestId('settings-option-theme-light-btn')).toBeFocused();

	// Останній пункт — мова, бо групи йдуть у порядку «тема, стиль, мова».
	await page.keyboard.press('End');
	await expect(page.getByTestId('settings-option-lang-en-link')).toBeFocused();

	// Escape closes and hands focus back, rather than stranding the user inside.
	await page.keyboard.press('Escape');
	await expect(page.getByRole('menu')).toBeHidden();
	await expect(page.getByTestId('settings-toggle-btn')).toBeFocused();
});
