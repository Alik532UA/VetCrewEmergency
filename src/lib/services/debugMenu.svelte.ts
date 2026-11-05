import { viewMode } from '$lib/controllers/viewMode.svelte';

/**
 * Керування станом відкриття debug меню:
 * - на робочому порталі: відкриття випадаючого меню налаштувань (DropdownMenu у HeaderControls)
 * - на презентаційній заглушці: відкриття нижньої панелі розробника (HiddenPanel / dev info у EmergencyStub)
 */
class DebugMenuService {
	portalOpen = $state(false);
	stubOpen = $state(false);

	toggle(): void {
		if (viewMode.isStub) {
			this.stubOpen = !this.stubOpen;
		} else {
			this.portalOpen = !this.portalOpen;
		}
	}

	closePortal(): void {
		this.portalOpen = false;
	}

	togglePortal(): void {
		this.portalOpen = !this.portalOpen;
	}

	closeStub(): void {
		this.stubOpen = false;
	}

	toggleStub(): void {
		this.stubOpen = !this.stubOpen;
	}
}

export const debugMenu = new DebugMenuService();
