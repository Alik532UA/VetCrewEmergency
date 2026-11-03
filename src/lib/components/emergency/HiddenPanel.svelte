<script lang="ts">
	import { fade } from 'svelte/transition';
	import { settings } from '$lib/services/settings.svelte';
	import { canFullscreen, toggleFullscreen, isFullscreenActive } from '$lib/services/fullscreen';
	import HiddenPanelIcon from './HiddenPanelIcon.svelte';

	interface Props {
		isVisible?: boolean;
		isPinned?: boolean;
	}

	let { isVisible = false, isPinned = $bindable(false) }: Props = $props();

	let isSupported = $state(true);
	let isFullscreen = $state(false);
	let isDark = $derived(settings.theme === 'dark');
	let isUk = $derived(settings.locale === 'uk');

	let isHovered = $state(false);
	let isFocused = $state(false);

	let showTooltip = $derived(isHovered || isFocused || isPinned);

	function toggleDevStatus() {
		isPinned = !isPinned;
	}

	$effect(() => {
		if (typeof document === 'undefined') return;
		isSupported = canFullscreen();
		isFullscreen = isFullscreenActive();

		const onFsChange = () => (isFullscreen = isFullscreenActive());
		const onDocClick = (e: MouseEvent) => {
			if (isPinned && !(e.target as HTMLElement | null)?.closest('.dev-action-wrap')) {
				isPinned = false;
			}
		};

		document.addEventListener('fullscreenchange', onFsChange);
		document.addEventListener('webkitfullscreenchange', onFsChange);
		document.addEventListener('click', onDocClick);
		return () => {
			document.removeEventListener('fullscreenchange', onFsChange);
			document.removeEventListener('webkitfullscreenchange', onFsChange);
			document.removeEventListener('click', onDocClick);
		};
	});

	function toggleLang() {
		settings.setLocale(settings.locale === 'uk' ? 'en' : 'uk');
	}
</script>

<nav
	class="hidden-panel-wrapper"
	class:is-visible={isVisible}
	aria-label="Додаткові налаштування"
	aria-hidden={!isVisible}
>
	<div class="hidden-panel-content">
		<!-- 1. ТЕМА -->
		<button
			type="button"
			class="action-item"
			onclick={() => settings.toggleTheme()}
			aria-label={isUk ? 'Тема' : 'Theme'}
			aria-keyshortcuts="t"
			title={isUk ? 'Тема (T)' : 'Theme (T)'}
		>
			<span class="action-icon-box">
				<HiddenPanelIcon name={isDark ? 'sun' : 'moon'} />
			</span>
			<span class="action-title">{isUk ? 'Тема' : 'Theme'}</span>
		</button>

		<!-- 2. МОВА -->
		<button
			type="button"
			class="action-item lang-toggle-item"
			onclick={toggleLang}
			aria-label={isUk ? 'Мова: Українська' : 'Language: English'}
			aria-keyshortcuts="l"
			title={isUk ? 'Мова (L)' : 'Language (L)'}
		>
			<span class="action-icon-box">
				<HiddenPanelIcon name="globe" />
			</span>
			<span class="action-title">{settings.locale.toUpperCase()}</span>
		</button>

		<!-- 3. У РОЗРОБЦІ (i) -->
		<div class="action-item-wrap dev-action-wrap">
			<button
				type="button"
				class="action-item dev-item"
				class:is-active={showTooltip}
				onclick={toggleDevStatus}
				onmouseenter={() => (isHovered = true)}
				onmouseleave={() => (isHovered = false)}
				onfocus={() => (isFocused = true)}
				onblur={() => (isFocused = false)}
				aria-label={isUk ? 'У розробці' : 'In dev'}
				aria-expanded={showTooltip}
				aria-keyshortcuts="i"
				title={isUk ? 'У розробці (I)' : 'In dev (I)'}
			>
				<span class="action-icon-box dev-icon-box">
					<HiddenPanelIcon name="info" />
				</span>
				<span class="action-title dev-title">{isUk ? 'У розробці' : 'In dev'}</span>
			</button>

			{#if showTooltip}
				<div class="dev-capsule-tooltip" role="status" transition:fade={{ duration: 160 }}>
					<span class="dev-capsule-text"
						>{isUk
							? 'Сайт знаходиться у процесі наповнення'
							: 'Website content is currently in progress'}</span
					>
				</div>
			{/if}
		</div>

		<!-- 4. ПОВНИЙ ЕКРАН (якщо підтримується) -->
		{#if isSupported}
			<button
				type="button"
				class="action-item fullscreen-item"
				onclick={toggleFullscreen}
				aria-label={isUk
					? isFullscreen
						? 'Звичайний екран'
						: 'На весь екран'
					: isFullscreen
						? 'Exit Fullscreen'
						: 'Fullscreen'}
				aria-keyshortcuts="f"
				title={isUk ? 'Екран (F)' : 'Fullscreen (F)'}
			>
				<span class="action-icon-box">
					<HiddenPanelIcon name={isFullscreen ? 'exit-fullscreen' : 'enter-fullscreen'} />
				</span>
				<span class="action-title">{isUk ? 'Екран' : 'Screen'}</span>
			</button>
		{/if}
	</div>
</nav>

<style>
	.hidden-panel-wrapper {
		position: fixed;
		bottom: 1.5rem;
		left: 0;
		right: 0;
		z-index: 40;
		display: flex;
		justify-content: center;
		pointer-events: none;
		opacity: 0;
		transform: translateY(40px) scale(0.96);
		transition:
			transform 0.65s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.hidden-panel-wrapper.is-visible {
		pointer-events: auto;
		opacity: 1;
		transform: translateY(0) scale(1);
	}

	.hidden-panel-content {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		padding: 0.65rem 1.15rem;
		background: rgba(255, 255, 255, 0.76);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border: 1px solid rgba(19, 55, 27, 0.12);
		border-radius: 9999px;
		box-shadow:
			0 16px 40px -10px rgba(19, 55, 27, 0.12),
			0 0 25px rgba(0, 0, 0, 0.03);
	}

	:global([data-theme='dark']) .hidden-panel-content {
		background: rgba(19, 35, 22, 0.82);
		border-color: rgba(255, 255, 255, 0.12);
		box-shadow:
			0 16px 40px -10px rgba(0, 0, 0, 0.5),
			0 0 25px rgba(0, 0, 0, 0.2);
	}

	.action-item-wrap {
		position: relative;
		display: flex;
	}

	.action-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 78px;
		height: 64px;
		gap: 0.35rem;
		padding: 0.45rem 0.6rem;
		border-radius: 12px;
		background: transparent;
		border: 1px solid transparent;
		color: #4a634e;
		cursor: pointer;
		font-family: inherit;
		transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
		user-select: none;
		-webkit-user-select: none;
		outline: none;
	}

	:global([data-theme='dark']) .action-item {
		color: #8ea391;
	}

	.action-item:hover {
		color: #0c1c10;
		background: rgba(19, 55, 27, 0.08);
		border-color: rgba(19, 55, 27, 0.28);
		transform: translateY(-2px);
	}

	:global([data-theme='dark']) .action-item:hover {
		color: #f0f4f0;
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.action-icon-box {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.action-item:hover .action-icon-box {
		transform: scale(1.14);
	}

	.action-title {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.03em;
		white-space: nowrap;
	}

	.dev-item,
	.dev-icon-box,
	.dev-title {
		color: #ffb327;
	}

	.dev-icon-box {
		filter: drop-shadow(0 0 6px rgba(255, 179, 39, 0.5));
	}

	.dev-item:hover .dev-icon-box,
	.dev-item.is-active .dev-icon-box {
		transform: scale(1.14);
		filter: drop-shadow(0 0 10px rgba(255, 179, 39, 0.9));
	}

	.dev-item.is-active {
		background: rgba(255, 179, 39, 0.1);
		border-color: rgba(255, 179, 39, 0.35);
		transform: translateY(-2px);
	}

	.dev-capsule-tooltip {
		position: absolute;
		bottom: calc(100% + 14px);
		left: 50%;
		transform: translateX(-50%);
		padding: 0.55rem 1.15rem;
		background: rgba(12, 22, 14, 0.94);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border: 1px solid rgba(255, 179, 39, 0.85);
		border-radius: 10px;
		box-shadow:
			0 0 14px rgba(255, 179, 39, 0.25),
			0 8px 24px rgba(0, 0, 0, 0.55);
		z-index: 60;
		pointer-events: none;
		white-space: nowrap;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global([data-theme='light']) .dev-capsule-tooltip {
		background: rgba(255, 255, 255, 0.96);
		border: 1.5px solid #ffb327;
		box-shadow:
			0 0 14px rgba(255, 179, 39, 0.25),
			0 8px 20px rgba(0, 0, 0, 0.12);
	}

	.dev-capsule-text {
		font-size: 0.85rem;
		font-weight: 600;
		color: #ffffff;
		letter-spacing: 0.015em;
		line-height: 1.25;
	}

	:global([data-theme='light']) .dev-capsule-text {
		color: #101e14;
	}

	@media (max-width: 640px) {
		.hidden-panel-wrapper {
			bottom: 0.85rem;
			padding: 0 0.5rem;
			box-sizing: border-box;
		}

		.hidden-panel-content {
			gap: 0.2rem;
			padding: 0.45rem 0.6rem;
		}

		.action-item {
			width: 68px;
			height: 56px;
		}
	}
</style>
