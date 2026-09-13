import { describe, expect, it } from 'vitest';
import { easeInOutSine, easeOutCubic, isTrackpadEvent, snapDuration } from './snapScroll';

describe('snapScroll utilities', () => {
	it('easeInOutSine computes smooth values from 0 to 1', () => {
		expect(easeInOutSine(0)).toBe(0);
		expect(easeInOutSine(0.5)).toBeCloseTo(0.5, 10);
		expect(easeInOutSine(1)).toBe(1);
		expect(easeInOutSine(0.25)).toBeCloseTo(0.14645, 4);
		expect(easeInOutSine(0.75)).toBeCloseTo(0.85355, 4);
	});

	it('easeInOutSine moves visibly in its first tenth', () => {
		// Причина заміни куба: 0.004 від дороги за першу десяту — це нуль пікселів
		// на екрані, тобто та сама «затримка перед скролом», лише вже не від
		// браузера, а від кривої.
		expect(easeInOutSine(0.1)).toBeGreaterThan(0.02);
		// І при цьому кінець лишається доведенням, а не обрізанням.
		expect(1 - easeInOutSine(0.9)).toBeLessThan(0.03);
	});

	it('easeOutCubic starts at full speed and brakes at the end', () => {
		// Це і є причина, чому крива тут окрема: клік коліщатка посеред їзди
		// перезапускає анімацію, і ease-in-out почав би її з нуля — видиме сіпання.
		expect(easeOutCubic(0)).toBe(0);
		expect(easeOutCubic(1)).toBe(1);
		// Півдороги пройдено раніше за половину часу — розгону немає.
		expect(easeOutCubic(0.5)).toBeGreaterThan(0.8);
		// Швидкість на старті більша, ніж у ease-in-out на його найшвидшій ділянці.
		expect(easeOutCubic(0.05)).toBeGreaterThan(easeInOutSine(0.5) - easeInOutSine(0.45));
	});

	it('snapDuration keeps the speed, not the time, roughly constant', () => {
		// Розділ на весь екран — базові 900 ms.
		expect(snapDuration(900, 900)).toBe(900);
		// Два розділи поспіль: довше, але не вдвічі — інакше довга дорога тягнеться.
		expect(snapDuration(1800, 900)).toBeGreaterThan(900);
		expect(snapDuration(1800, 900)).toBeLessThan(1800);
		// Межі тримаються: коротка дорога не миготить, довга не нудить.
		expect(snapDuration(10, 900)).toBe(450);
		expect(snapDuration(100000, 900)).toBe(1400);
		// Нуль і від'ємне не мають ділити на нуль чи дати NaN: обидва операнди
		// підняті до 1, тож відношення лишається 1, а не 0/0.
		expect(snapDuration(0, 0)).toBe(900);
		expect(Number.isFinite(snapDuration(-100, -100))).toBe(true);
	});

	it('isTrackpadEvent distinguishes trackpad from mouse wheel', () => {
		// Mouse wheel (lines mode)
		expect(isTrackpadEvent({ deltaMode: 1, deltaX: 0, deltaY: 3 })).toBe(false);
		// Mouse wheel (pixel mode standard notch 100 or 120)
		expect(isTrackpadEvent({ deltaMode: 0, deltaX: 0, deltaY: 100 })).toBe(false);
		expect(isTrackpadEvent({ deltaMode: 0, deltaX: 0, deltaY: -120 })).toBe(false);

		// Trackpad (fractional delta or small delta or horizontal delta)
		expect(isTrackpadEvent({ deltaMode: 0, deltaX: 0, deltaY: 12.5 })).toBe(true);
		expect(isTrackpadEvent({ deltaMode: 0, deltaX: 5, deltaY: 50 })).toBe(true);
		expect(isTrackpadEvent({ deltaMode: 0, deltaX: 0, deltaY: 15 })).toBe(true);
	});
});
