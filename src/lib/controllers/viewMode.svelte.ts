import { browser } from '$app/environment';
import { storage } from '$lib/services/storage';
import { toast } from '$lib/controllers/toast.svelte';
import { logService } from '$lib/services/logService.svelte';

export type ViewMode = 'portal' | 'stub';

/**
 * Початковий режим сайту:
 * - 'portal' — поточний робочий сайт (для перевірки та заповнення клієнтом).
 * - 'stub' — презентаційна заглушка (як у VetCrewHospital та VetCrewMain).
 *
 * Після схвалення клієнтом достатньо змінити значення цієї константи на 'stub'.
 */
export const DEFAULT_VIEW_MODE: ViewMode = 'portal';

const STORAGE_KEY = 'view_mode';
const TAP_THRESHOLD = 7;
const TAP_WINDOW_MS = 2500;

class ViewModeController {
	current = $state<ViewMode>(this.resolveInitialMode());

	get isStub(): boolean {
		return this.current === 'stub';
	}

	get isPortal(): boolean {
		return this.current === 'portal';
	}

	#tapCount = 0;
	#tapTimer: ReturnType<typeof setTimeout> | undefined;

	private resolveInitialMode(): ViewMode {
		if (browser) {
			try {
				const params = new URLSearchParams(window.location.search);
				const param = params.get('view');
				if (param === 'stub' || param === 'portal') {
					storage.set(STORAGE_KEY, param);
					return param;
				}
			} catch {
				// Ignore URL parse errors during SSG / hydration
			}

			const saved = storage.get(STORAGE_KEY);
			if (saved === 'stub' || saved === 'portal') {
				return saved;
			}
		}

		return DEFAULT_VIEW_MODE;
	}

	setMode(mode: ViewMode, notify = false): void {
		this.current = mode;
		if (browser) {
			storage.set(STORAGE_KEY, mode);
			logService.info('ui', `View mode set to: ${mode}`);
		}

		if (notify) {
			if (mode === 'stub') {
				toast.info('Увімкнено презентаційний вигляд (заглушка)', 4000);
			} else {
				toast.info('Увімкнено робочий портал для наповнення', 4000);
			}
		}
	}

	toggle(notify = true): ViewMode {
		const next: ViewMode = this.current === 'stub' ? 'portal' : 'stub';
		this.setMode(next, notify);
		return next;
	}

	/**
	 * Реєструє тач-тап по логотипу або футеру.
	 * 7 швидких тапів перемикають режим на смартфонах/планшетах.
	 */
	recordTouchTap(): void {
		if (this.#tapTimer !== undefined) {
			clearTimeout(this.#tapTimer);
		}

		this.#tapCount += 1;

		if (this.#tapCount >= TAP_THRESHOLD) {
			this.#tapCount = 0;
			this.toggle(true);
			return;
		}

		this.#tapTimer = setTimeout(() => {
			this.#tapCount = 0;
		}, TAP_WINDOW_MS);
	}
}

export const viewMode = new ViewModeController();
