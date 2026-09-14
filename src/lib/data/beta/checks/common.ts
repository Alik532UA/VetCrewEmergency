import type { BetaCheck } from '../types';

/**
 * Everything that is the same on every page: header, pickers, scrollbar, toasts,
 * footer. This tab claims no route of its own — the chrome has none.
 */
export const commonChecks: readonly BetaCheck[] = [
	{
		id: 'common_1',
		category: { uk: 'Тема', en: 'Theme' },
		text: {
			uk: 'Натисніть кнопку налаштувань у шапці. Мусить відкритися одне меню з трьох груп — тема, стиль, мова, — у кожній позначено поточний вибір; вибір теми одразу міняє кольори сторінки.',
			en: 'Press the settings button in the header. One menu must open with three groups — theme, style, language — each showing the current choice; picking a theme changes the page colours at once.'
		},
		testid: 'settings-toggle-btn',
		// Було `covered` з посиланням на `tests/ui.spec.ts` — файл приїхав копією з
		// adoptananimal, 89 із 95 його перевірок падали, і його видалено. Пункт
		// перевіряється руками, як і має: жоден автотест його не робить.
		coverage: 'testable'
	},
	{
		id: 'common_15',
		category: { uk: 'Тема', en: 'Theme' },
		text: {
			uk: 'На комп’ютері відкрийте налаштування й наведіть курсор на тему, якою ЗАРАЗ не користуєтесь, не натискаючи. Сторінка мусить показати цю тему цілком, а щойно курсор піде — повернутися до попередньої. Наведення на стиль чи мову теми міняти НЕ мусить.',
			en: 'On a desktop, open the settings and hover a theme you are NOT using, without clicking. The page must show that theme in full and return to the previous one as soon as the pointer leaves. Hovering a style or a language must NOT change the theme.'
		},
		testid: 'settings-menu',
		coverage: 'manual'
	},
	{
		id: 'common_2',
		category: { uk: 'Тема', en: 'Theme' },
		text: {
			uk: 'Оберіть тему, перезавантажте сторінку клавішею F5. Обрана тема мусить лишитися; білого спалаху між завантаженням і кольорами бути НЕ мусить.',
			en: 'Pick a theme, then reload with F5. The theme must survive, and there must be NO white flash between the load and the colours.'
		},
		negative: true,
		coverage: 'manual'
	},
	{
		id: 'common_3',
		category: { uk: 'Тема', en: 'Theme' },
		text: {
			uk: 'Пройдіть обидві теми на цій сторінці. У кожній усі написи мусять читатися; напису, що зливається з тлом, бути НЕ мусить.',
			en: 'Walk through both themes on this page. Every label must stay readable in each; no label may blend into its background.'
		},
		negative: true,
		coverage: 'covered',
		test: 'tests/a11y.spec.ts'
	},
	{
		id: 'common_4',
		category: { uk: 'Вигляд', en: 'Style' },
		text: {
			uk: 'У налаштуваннях знайдіть групу «Стиль». Мусить бути рівно два варіанти; перемикання міняє форму кутів у кнопок і карток, а кольори лишає ті самі.',
			en: 'Find the “Style” group in the settings. There must be exactly two options; switching changes the corner shapes of buttons and cards and leaves the colours alone.'
		},
		testid: 'settings-toggle-btn',
		// `tests/skin-overrides.spec.ts` видалено разом із чужим `/adopt/cat` і
		// `.animal-card`, на яких він стояв. Сама вимога — щоб скін перемагав власне
		// правило компонента — лишилася під наглядом `src/style-overrides.test.ts`,
		// але цей пункт про ВИГЛЯД кутів, і його дивляться очима.
		coverage: 'testable'
	},
	{
		id: 'common_5',
		category: { uk: 'Мова', en: 'Language' },
		text: {
			uk: 'У налаштуваннях оберіть English. Адреса мусить початися з /en/, а всі підписи стати англійськими — включно з шапкою й підвалом.',
			en: 'Pick English in the settings. The address must start with /en/ and every label must turn English — header and footer included.'
		},
		testid: 'settings-toggle-btn',
		coverage: 'covered',
		test: 'tests/i18n.spec.ts'
	},
	{
		id: 'common_6',
		category: { uk: 'Мова', en: 'Language' },
		text: {
			uk: 'Перемкніться на English і назад на українську. Змішаних підписів — половина однією мовою, половина іншою — лишитися НЕ мусить.',
			en: 'Switch to English and back to Ukrainian. No mixed labels — half in one language, half in the other — may be left.'
		},
		testid: 'settings-toggle-btn',
		negative: true,
		coverage: 'manual'
	},
	{
		id: 'common_7',
		category: { uk: 'Смуга прокрутки', en: 'Scrollbar' },
		text: {
			uk: 'Клацніть правою кнопкою по смузі прокрутки справа. Мусить відкритися меню з чотирьох варіантів; візуальна мінімапа показує зменшену копію сторінки з фотографіями.',
			en: 'Right-click the scrollbar on the right. A menu of four options must open; the visual minimap shows a shrunken copy of the page, photographs and all.'
		},
		testid: 'page-scrollbar-container',
		coverage: 'testable'
	},
	{
		id: 'common_8',
		category: { uk: 'Смуга прокрутки', en: 'Scrollbar' },
		text: {
			uk: 'Увімкніть візуальну мінімапу й натисніть Tab кілька разів. Фокус НЕ мусить заходити в мінімапу — рамка ходить лише по справжній сторінці.',
			en: 'Turn the visual minimap on and press Tab a few times. Focus must NOT enter the minimap — the ring stays on the real page.'
		},
		testid: 'minimap-container',
		negative: true,
		coverage: 'covered',
		test: 'tests/scrollbar.spec.ts'
	},
	{
		id: 'common_9',
		category: { uk: 'Пошта', en: 'Email' },
		text: {
			uk: 'На сторінці «Про нас» натисніть адресу пошти. Мусить з’явитися повідомлення біля самої адреси з кнопкою «Відкрити пошту», а адреса — потрапити в буфер обміну: вставте її кудись.',
			en: 'On the “About” page press the email address. A message must appear beside the address itself with an «Open mail client» button, and the address must be in the clipboard — paste it somewhere.'
		},
		testid: 'about-contacts-list',
		coverage: 'testable'
	},
	{
		id: 'common_10',
		category: { uk: 'Повідомлення', en: 'Toasts' },
		text: {
			uk: 'Викличте повідомлення й тримайте на ньому курсор. Поки курсор на ньому, воно зникнути НЕ мусить.',
			en: 'Trigger a message and keep the pointer on it. While the pointer is there it must NOT disappear.'
		},
		negative: true,
		coverage: 'covered',
		test: 'tests/toast.spec.ts'
	},
	{
		id: 'common_11',
		category: { uk: 'Нагору', en: 'Back to top' },
		text: {
			uk: 'Прокрутіть сторінку вниз. Праворуч знизу мусить з’явитися кругла кнопка зі стрілкою; натиснута — плавно повертає на початок.',
			en: 'Scroll the page down. A round arrow button must appear at the bottom right; pressing it glides back to the start.'
		},
		testid: 'back-to-top-btn',
		coverage: 'testable'
	},
	{
		id: 'common_12',
		category: { uk: 'Телефон', en: 'Phone' },
		text: {
			uk: 'На телефоні натисніть кнопку меню в шапці. Пункти мусять бути рядками на всю ширину; поточна сторінка позначена не лише кольором, а й білою смужкою зліва.',
			en: 'On a phone, press the menu button in the header. Items must be full-width rows, and the current page is marked by a white bar on the left as well as by colour.'
		},
		testid: 'mobile-menu-burger-btn',
		coverage: 'testable'
	},
	{
		id: 'common_13',
		category: { uk: 'Телефон', en: 'Phone' },
		text: {
			uk: 'На телефоні поверніть його горизонтально й пройдіть сторінки. Сторінка НЕ мусить їхати вбік — горизонтальної прокрутки бути не мусить ніде.',
			en: 'On a phone, turn it sideways and walk the pages. The page must NOT slide sideways — no horizontal scrolling anywhere.'
		},
		negative: true,
		coverage: 'covered',
		test: 'tests/fluid-sizing.spec.ts'
	},
	{
		id: 'common_14',
		category: { uk: 'Службове', en: 'Internal' },
		text: {
			uk: 'Пройдіть кілька сторінок. Червоної круглої кнопки з цифрою в лівому нижньому куті бути НЕ мусить — вона лише для розробника.',
			en: 'Walk a few pages. There must be NO red round button with a number in the bottom-left corner — that one is for the developer only.'
		},
		testid: 'debug-log-copy-btn',
		negative: true,
		coverage: 'manual'
	},
	{
		/*
		 * Дописано при переході на канон 9.3 (§ 3.4, `BETA-LEVEL-BALANCE`): вкладка
		 * мала 4 пункти для людини проти 5 покритих, тобто контрольна група була
		 * більшою за роботу. Пункт написаний після читання `app.css` — коментар над
		 * `@keyframes beacon-a` прямо каже, що під `prefers-reduced-motion` кадр
		 * лишається без світла, — а не вигаданий під потрібне число.
		 *
		 * Машині це не віддати: наявний прогін Playwright уже йде з
		 * `reducedMotion: 'reduce'` постійно, тож ПЕРЕМИКАННЯ між двома станами
		 * там не відтворюється, а саме воно тут і перевіряється.
		 */
		id: 'common_16',
		category: { uk: 'Рух', en: 'Motion' },
		text: {
			uk: 'Увімкніть у системі «зменшити рух» і відкрийте головну. Кнопка гарячої лінії мусить просто світитися рівно: проблисків бути НЕ мусить. Вимкніть налаштування й перезавантажте — проблиски мусять повернутися.',
			en: 'Turn on reduced motion in your system and open the main page. The hotline button must simply glow steadily: there must be NO flashing. Turn the setting off, reload — and the flashing must come back.'
		},
		testid: 'hero-report-link',
		negative: true,
		coverage: 'manual'
	}
];
