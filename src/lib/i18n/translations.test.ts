import { describe, expect, it } from 'vitest';
import { en } from './translations/en';
import { uk } from './translations/uk';

/**
 * Паритет ключів між мовами.
 *
 * База — УКРАЇНСЬКА: вона типова, вона в корені, і саме її правлять першою.
 * Доти базою була англійська, і після переходу на дві мови перевірка на мить
 * звелася до порівняння `en` із `en` — тобто до твердження, яке не може стати
 * червоним. Такий тест гірший за відсутній: він зелений і тому виглядає як
 * доказ.
 *
 * Тип у `index.ts` бере ключі з `en`, і це не суперечність: тип каже, які ключі
 * ІСНУЮТЬ, а цей тест — що переклад на них є в обох мовах.
 */
const base = uk;
const others = { en };

describe('паритет перекладів', () => {
	it('перевірка жива: ключів достатньо, щоб було що звіряти', () => {
		expect(Object.keys(base).length).toBeGreaterThan(50);
	});

	for (const [code, strings] of Object.entries(others)) {
		it(`${code} має рівно ті самі ключі, що й uk`, () => {
			expect(Object.keys(strings).sort()).toEqual(Object.keys(base).sort());
		});

		it(`${code} не має порожніх значень`, () => {
			const empty = Object.entries(strings)
				.filter(([, value]) => (value as string).trim() === '')
				.map(([key]) => key);
			expect(empty).toEqual([]);
		});
	}

	it('uk не має порожніх значень', () => {
		const empty = Object.entries(base)
			.filter(([, value]) => value.trim() === '')
			.map(([key]) => key);
		expect(empty).toEqual([]);
	});
});
