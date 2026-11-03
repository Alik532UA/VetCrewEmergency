import { describe, expect, it, beforeEach } from 'vitest';
import { viewMode, DEFAULT_VIEW_MODE } from './viewMode.svelte';
import { storage } from '$lib/services/storage';

describe('viewMode controller (Presentation Stub & Gesture Switcher)', () => {
	beforeEach(() => {
		storage.remove('view_mode');
		viewMode.setMode(DEFAULT_VIEW_MODE, false);
	});

	it('defaults to portal mode initially', () => {
		expect(DEFAULT_VIEW_MODE).toBe('portal');
		expect(viewMode.current).toBe('portal');
		expect(viewMode.isPortal).toBe(true);
		expect(viewMode.isStub).toBe(false);
	});

	it('toggles mode between portal and stub', () => {
		expect(viewMode.toggle(false)).toBe('stub');
		expect(viewMode.isStub).toBe(true);
		expect(viewMode.current).toBe('stub');

		expect(viewMode.toggle(false)).toBe('portal');
		expect(viewMode.isPortal).toBe(true);
		expect(viewMode.current).toBe('portal');
	});

	it('triggers mode toggle after 7 rapid touch taps', () => {
		expect(viewMode.isStub).toBe(false);

		for (let i = 0; i < 6; i++) {
			viewMode.recordTouchTap();
			expect(viewMode.isStub).toBe(false);
		}

		// 7th tap completes the gesture
		viewMode.recordTouchTap();
		expect(viewMode.isStub).toBe(true);
	});
});
