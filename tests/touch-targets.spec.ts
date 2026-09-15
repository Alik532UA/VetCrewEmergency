import { expect, test, type Locator, type Page } from './fixtures';

/**
 * ACCESSIBILITY-v8 §§ 8 and 10.3 — how big a thing you have to hit.
 *
 * The canon calls this the most precise rule in that file and the one that went
 * longest without a check, and both halves of that are true here: the number was
 * written down in AGENTS.md and nothing measured it.
 *
 * Two thresholds, because they are two different statements.
 *
 * 24×24 is WCAG 2.2 AA (SC 2.5.8). Below it is a conformance failure, so it is a
 * hard error with no list and no exceptions.
 *
 * 44×44 is this project's own standard — stricter than the spec on purpose,
 * because a target that merely conforms is still awkward with a thumb. Today
 * several controls sit between the two, so that tier carries an explicit list of
 * what is short and by how much. The list is the point: it goes in every diff,
 * it can only be shortened, and a control that is not on it may not shrink.
 */

const WCAG_MINIMUM = 24;
const PROJECT_STANDARD = 44;

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

const INTERACTIVE = 'button, a[href], input:not([type=hidden]), select, [role="button"]';

/**
 * Controls that meet WCAG but not this project's 44px, as measured on a 390×844
 * phone. Every entry is a real shortfall, not an exemption on principle.
 *
 * Entries come off this list; they do not go on. Raising one means giving the
 * control room — usually a `min-height`, since these are all short rather than
 * narrow — and deleting its line here.
 */
const BELOW_PROJECT_STANDARD = new Set<string>([
	// Порожній, і це стан, а не забутий рядок.
	//
	// Тут лежали чотирнадцять записів, і всі до одного належали adoptananimal: фільтри
	// собак за статтю й розміром, прапорці `de`/`at`/`nl` у блоці «про нас», мобільний
	// логотип того проєкту. Жодного з цих елементів тут немає, тож перелік нічого не
	// пропускав — він лише створював враження, ніби в цьому проєкті є чотирнадцять
	// свідомо прийнятих недоборів.
	//
	// Справжні недобори, знайдені після очищення, сюди НЕ додані, а виправлені: значки
	// соцмереж і сусідніх сайтів у підвалі дістали область дотику 44px (самі значки
	// лишилися 28 і 22), посилання «Детальніше» на картках — `min-height: 44px`.
	// Правило цього файлу каже прямо: записи звідси виходять, а не заходять.
	//
	// Один запис лишився — і він тутешній, а не успадкований. 229×32: напис логотипа
	// в мобільній смузі. Смуга має 72px на все, і 44 під логотип зробили б її вищою
	// на найменших екранах, де висота дорожча за все. Поруч, у тій самій смузі, стоїть
	// кнопка гарячої лінії, і ВОНА 44: до номера дотягнутися треба, до назви сайту — ні.
	'header-logo-mobile-link'
]);

/** A phone, and touch — `hover: hover` changes which controls are even rendered. */
test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

type Target = { id: string; width: number; height: number; html: string };

async function visibleTargets(page: Page): Promise<Target[]> {
	const locator: Locator = page.locator(INTERACTIVE);
	return locator.evaluateAll((nodes) =>
		nodes
			.map((node) => {
				const box = node.getBoundingClientRect();
				const style = getComputedStyle(node);
				const hidden =
					style.visibility === 'hidden' || style.display === 'none' || box.width * box.height === 0;
				return hidden
					? null
					: {
							id: node.getAttribute('data-testid') ?? '',
							width: Math.round(box.width),
							height: Math.round(box.height),
							html: node.outerHTML.replace(/\s+/g, ' ').slice(0, 80)
						};
			})
			.filter((t): t is Target => t !== null)
	);
}

for (const path of PAGES) {
	test(`${path}: every target clears the WCAG 2.2 minimum of ${WCAG_MINIMUM}px`, async ({
		page
	}) => {
		await page.goto(path);
		await expect(page.locator('main')).toBeVisible();

		const targets = await visibleTargets(page);
		expect(targets.length, 'nothing interactive found — the check is dead').toBeGreaterThan(0);

		const failing = targets
			.filter((t) => t.width < WCAG_MINIMUM || t.height < WCAG_MINIMUM)
			.map((t) => `${t.width}×${t.height} ${t.id || t.html}`);

		expect(failing, `below WCAG 2.2 AA (SC 2.5.8):\n${failing.join('\n')}`).toEqual([]);
	});

	test(`${path}: nothing new falls under the project's ${PROJECT_STANDARD}px`, async ({ page }) => {
		await page.goto(path);
		await expect(page.locator('main')).toBeVisible();

		const targets = await visibleTargets(page);
		expect(targets.length, 'nothing interactive found — the check is dead').toBeGreaterThan(0);

		const unexpected = targets
			.filter((t) => t.width < PROJECT_STANDARD || t.height < PROJECT_STANDARD)
			.filter((t) => !BELOW_PROJECT_STANDARD.has(t.id))
			.map((t) => `${t.width}×${t.height} ${t.id || t.html}`);

		expect(
			unexpected,
			`under ${PROJECT_STANDARD}px and not on the known list:\n${unexpected.join('\n')}`
		).toEqual([]);
	});
}

test('the known-shortfall list holds nothing that has since been given room', async ({ page }) => {
	// A stale entry is how an allowlist quietly becomes permission. Once a control
	// reaches 44 this fails until its name comes off, so the list only shrinks.
	const stillShort = new Set<string>();

	for (const path of PAGES) {
		await page.goto(path);
		await expect(page.locator('main')).toBeVisible();

		for (const target of await visibleTargets(page)) {
			if (!target.id || !BELOW_PROJECT_STANDARD.has(target.id)) continue;
			if (target.width < PROJECT_STANDARD || target.height < PROJECT_STANDARD) {
				stillShort.add(target.id);
			}
		}
	}

	const settled = [...BELOW_PROJECT_STANDARD].filter((id) => !stillShort.has(id));
	expect(
		settled,
		`now ${PROJECT_STANDARD}px or larger — remove from the list:\n${settled.join('\n')}`
	).toEqual([]);
});
