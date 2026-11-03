import { browser } from '$app/environment';

export function canFullscreen(): boolean {
	if (!browser) return false;
	const doc = document as unknown as {
		fullscreenEnabled?: boolean;
		webkitFullscreenEnabled?: boolean;
		mozFullScreenEnabled?: boolean;
		msFullscreenEnabled?: boolean;
	};
	const root = document.documentElement as unknown as {
		requestFullscreen?: () => Promise<void>;
		webkitRequestFullscreen?: () => Promise<void>;
		mozRequestFullScreen?: () => Promise<void>;
		msRequestFullscreen?: () => Promise<void>;
	};
	const hasApi = Boolean(
		root?.requestFullscreen ||
		root?.webkitRequestFullscreen ||
		root?.mozRequestFullScreen ||
		root?.msRequestFullscreen
	);
	const isEnabled =
		doc.fullscreenEnabled ??
		doc.webkitFullscreenEnabled ??
		doc.mozFullScreenEnabled ??
		doc.msFullscreenEnabled;
	return Boolean(hasApi && isEnabled !== false);
}

export function isFullscreenActive(): boolean {
	if (!browser) return false;
	const doc = document as unknown as {
		fullscreenElement?: Element;
		webkitFullscreenElement?: Element;
		mozFullScreenElement?: Element;
		msFullscreenElement?: Element;
	};
	return Boolean(
		doc.fullscreenElement ||
		doc.webkitFullscreenElement ||
		doc.mozFullScreenElement ||
		doc.msFullscreenElement
	);
}

export function toggleFullscreen(): void {
	if (!canFullscreen()) return;
	const doc = document as unknown as {
		exitFullscreen?: () => Promise<void>;
		webkitExitFullscreen?: () => Promise<void>;
		mozCancelFullScreen?: () => Promise<void>;
		msExitFullscreen?: () => Promise<void>;
	};
	const root = document.documentElement as unknown as {
		requestFullscreen?: () => Promise<void>;
		webkitRequestFullscreen?: () => Promise<void>;
		mozRequestFullScreen?: () => Promise<void>;
		msRequestFullscreen?: () => Promise<void>;
	};

	if (isFullscreenActive()) {
		const exit =
			doc.exitFullscreen ||
			doc.webkitExitFullscreen ||
			doc.mozCancelFullScreen ||
			doc.msExitFullscreen;
		exit?.call(doc)?.catch?.(() => {});
	} else {
		const request =
			root.requestFullscreen ||
			root.webkitRequestFullscreen ||
			root.mozRequestFullScreen ||
			root.msRequestFullscreen;
		request?.call(root)?.catch?.(() => {});
	}
}
