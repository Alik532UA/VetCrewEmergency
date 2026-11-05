import { describe, it, expect, beforeEach } from 'vitest';
import { debugMenu } from './debugMenu.svelte';
import { viewMode } from '$lib/controllers/viewMode.svelte';

describe('debugMenu service', () => {
	beforeEach(() => {
		debugMenu.closePortal();
		debugMenu.closeStub();
	});

	it('toggles portal menu when in portal mode', () => {
		viewMode.setMode('portal');
		expect(debugMenu.portalOpen).toBe(false);

		debugMenu.toggle();
		expect(debugMenu.portalOpen).toBe(true);

		debugMenu.toggle();
		expect(debugMenu.portalOpen).toBe(false);
	});

	it('toggles stub dev panel when in stub mode', () => {
		viewMode.setMode('stub');
		expect(debugMenu.stubOpen).toBe(false);

		debugMenu.toggle();
		expect(debugMenu.stubOpen).toBe(true);

		debugMenu.toggle();
		expect(debugMenu.stubOpen).toBe(false);
	});

	it('can open and close explicitly', () => {
		debugMenu.togglePortal();
		expect(debugMenu.portalOpen).toBe(true);
		debugMenu.closePortal();
		expect(debugMenu.portalOpen).toBe(false);

		debugMenu.toggleStub();
		expect(debugMenu.stubOpen).toBe(true);
		debugMenu.closeStub();
		expect(debugMenu.stubOpen).toBe(false);
	});
});

