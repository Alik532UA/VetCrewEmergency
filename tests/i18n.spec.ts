import { expect, test } from './fixtures';

/**
 * Перемикання мови мусить лишити читача на тій сторінці, яку він читав, а кожне
 * посилання після цього — лишитися в обраній мові. Помилка тут не дає нічого в
 * консолі: сайт просто тихо з'їжджає назад в українську.
 *
 * Файл приїхав копією з adoptananimal і був написаний під ЧОТИРИ мови (`de`, `nl`)
 * та маршрути прилаштування — усі три перевірки падали на першому ж переході.
 * Самі питання, які вони ставлять, від проєкту не залежать, тож переписано під
 * дві мови цього сайту й справжні сторінки, а не видалено.
 *
 * Сайт живе під базовим шляхом, тож адреси порівнюються хвостом, а не цілком:
 * `BASE_PATH` порожній у локальній збірці й `/VetCrewEmergency` на GitHub Pages,
 * і жорстка адреса зробила б файл зеленим рівно в одному з двох місць.
 */

/**
 * Ряд перемикачів у шапці схований до запуску сайту й відкривається службовим
 * жестом — сім натисків `H` (`HeaderControls.svelte`). Тест ставить прапорець
 * напряму, а не імітує жест: перевіряється мова, а не спосіб дістатися до меню, і
 * сім подій клавіатури зробили б падіння цього файлу неоднозначним.
 */
async function revealControls(page: import('@playwright/test').Page) {
	await page.addInitScript(() => {
		try {
			sessionStorage.setItem('vetcrewemergency_header_controls_visible', '1');
		} catch {
			/* приватний режим — перевірка нижче скаже, що меню не відкрилося */
		}
	});
}

test('перемикання мови лишає ту саму сторінку', async ({ page }) => {
	await revealControls(page);
	await page.goto('/library/fawn');

	// Мова живе в меню «Налаштування»; окремої кнопки мов більше немає.
	await page.getByTestId('settings-toggle-btn').click();
	const english = page.getByTestId('settings-option-lang-en-link');

	// Справжнє посилання, а не кнопка: його мусить бути видно пошуковому роботу й
	// можна відкрити в новій вкладці.
	await expect(english).toHaveAttribute('href', /\/en\/library\/fawn$/);
	await english.click();

	await expect(page).toHaveURL(/\/en\/library\/fawn$/);

	// З повторними спробами, а не одним зчитуванням: на клієнтському переході адреса
	// міняється першою, а атрибут приходить ефектом кадром пізніше. Миттєве зчитування
	// ловить старе значення приблизно раз на п'ять прогонів.
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('обрамлення сторінки — тією ж мовою, що й сама сторінка', async ({ page }) => {
	/*
	 * Дефект, від якого це стереже: пререндер проганяє всі сторінки в ОДНОМУ процесі,
	 * тож мова, залишена в модульному синглтоні, протікала на наступну сторінку —
	 * українська сторінка виходила з англійською навігацією.
	 */
	for (const [path, lang, chrome] of [
		['/', 'uk', 'Історії порятунку'],
		['/en', 'en', 'Rescue stories'],
		['/library', 'uk', 'Історії порятунку'],
		['/en/library', 'en', 'Rescue stories']
	] as const) {
		await page.goto(path);

		expect(await page.getAttribute('html', 'lang'), `${path} оголосила не ту мову`).toBe(lang);

		// `getByRole('banner')`, а не `locator('header')`: розділи сторінки теж мають
		// власні `<header>` — на головній їх сім, — і простий локатор ламається на
		// строгому режимі, не дійшовши до перевірки.
		//
		// Саме пункт навігації, а не заголовок сторінки: обрамлення й вміст приходять з
		// різних місць, і протікала саме мова обрамлення.
		await expect(page.getByRole('banner'), `${path}: шапка не тією мовою`).toContainText(chrome);
	}
});

test('кожна мова оголошує решту', async ({ page }) => {
	await page.goto('/library');

	const alternates = await page.$$eval('link[rel="alternate"]', (links) =>
		links.map((l) => ({ lang: l.getAttribute('hreflang'), href: l.getAttribute('href') }))
	);

	expect(alternates.map((a) => a.lang).sort()).toEqual(['en', 'uk', 'x-default']);
	// Абсолютні: відносний `hreflang` пошуковий робот просто не бере.
	expect(alternates.every((a) => a.href?.startsWith('https://'))).toBe(true);
});
