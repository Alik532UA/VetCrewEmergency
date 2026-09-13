import { describe, expect, it } from 'vitest';
import { easeInOutCubic, isTrackpadEvent } from './snapScroll';

describe('snapScroll utilities', () => {
	it('easeInOutCubic computes smooth values from 0 to 1', () => {
		expect(easeInOutCubic(0)).toBe(0);
		expect(easeInOutCubic(0.5)).toBe(0.5);
		expect(easeInOutCubic(1)).toBe(1);
		expect(easeInOutCubic(0.25)).toBeCloseTo(0.0625, 3);
		expect(easeInOutCubic(0.75)).toBeCloseTo(0.9375, 3);
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
