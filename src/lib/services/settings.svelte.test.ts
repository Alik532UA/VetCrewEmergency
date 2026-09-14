import { describe, expect, it } from 'vitest';
import { isBeaconMode, parseStoredFlag } from './settings.svelte';

/**
 * Правила читання налаштувань зі сховища.
 *
 * Сам сервіс — синглтон, що пише в `document` і тримає `$effect.root`; перевіряти
 * його цілком означало б піднімати браузер, і це вже роблять `tests/scrollbar.spec.ts`
 * та `tests/beta-checklist.spec.ts`. А от ДВА рішення всередині нього чисті й від браузера
 * не залежать зовсім — і саме вони псуються тихо: наслідок видно лише після
 * перезавантаження, коли настройка приходить не та, яку людина обрала.
 */
describe('читання вигляду зі сховища', () => {
	it('булеве значення розуміє лише як рядок, а не через Boolean()', () => {
		expect(parseStoredFlag('true')).toBe(true);
		expect(parseStoredFlag('false')).toBe(false);
	});

	it("'false' НЕ приходить істиною — це і є пастка, заради якої функція існує", () => {
		// `Boolean('false')` дорівнює true: наївний варіант вмикав би те, що людина
		// щойно вимкнула, і робив би це лише після перезавантаження — тобто скарга
		// прийшла б як «перемикач не тримається», а не як «читання зламане».
		expect(parseStoredFlag('false')).not.toBe(true);
		expect(Boolean('false')).toBe(true);
	});

	it('«нічого не збережено» — це null, а не false', () => {
		// Для облямівок і маячків типове значення — увімкнено. Сплутати ці два стани
		// означало б вимкнути їх усім, хто в налаштування не заходив.
		expect(parseStoredFlag(null)).toBeNull();
		expect(parseStoredFlag('')).toBeNull();
	});

	it('сміття зі сховища не стає значенням', () => {
		// Писати туди може будь-хто: рука в консолі, стара версія сайту, розширення.
		for (const junk of ['1', '0', 'TRUE', 'yes', 'null', 'undefined', '{}']) {
			expect(parseStoredFlag(junk), `«${junk}» пройшло як значення`).toBeNull();
		}
	});
});

describe('читання режиму маячка', () => {
	it('пропускає всі три справжні режими', () => {
		for (const mode of ['off', 'temporary', 'always']) {
			expect(isBeaconMode(mode), `${mode} не впізнано`).toBe(true);
		}
	});

	it('не пропускає нічого іншого', () => {
		for (const junk of [null, '', 'on', 'true', 'Always', 'temporary ', 'постійні']) {
			expect(isBeaconMode(junk), `«${junk}» пройшло як режим`).toBe(false);
		}
	});

	it('перевірка жива: перелік не порожній і не пропускає все підряд', () => {
		// Функція, що завжди каже true, дала б зелений і цей файл, і сторінку — до
		// дня, коли в сховищі опиниться рядок, якого немає в CSS.
		expect(isBeaconMode('off')).toBe(true);
		expect(isBeaconMode('off-by-one')).toBe(false);
	});
});
