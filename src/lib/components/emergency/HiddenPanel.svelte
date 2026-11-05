<script lang="ts">
	import { settings } from '$lib/services/settings.svelte';
	import { canFullscreen, toggleFullscreen, isFullscreenActive } from '$lib/services/fullscreen';
	import HiddenPanelIcon from './HiddenPanelIcon.svelte';
	import HiddenPanelTooltip from './HiddenPanelTooltip.svelte';

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

	let devText = $derived(
		isUk ? 'Цей сайт знаходиться в процесі розробки' : 'Website content is currently in progress'
	);
	let devLabel = $derived(isUk ? 'У розробці' : 'In dev');
	let fsLabel = $derived(
		isFullscreen
			? isUk
				? 'Звичайний екран'
				: 'Exit Fullscreen'
			: isUk
				? 'На весь екран'
				: 'Fullscreen'
	);

	function toggleDevStatus() {
		isPinned = !isPinned;
	}

	$effect(() => {
		if (typeof document === 'undefined') return;
		isSupported = canFullscreen();
		isFullscreen = isFullscreenActive();
		const onFs = () => (isFullscreen = isFullscreenActive());
		const onDoc = (e: MouseEvent) => {
			if (isPinned && !(e.target as HTMLElement | null)?.closest('.dev-panel-container')) {
				isPinned = false;
			}
		};
		const evts = ['fullscreenchange', 'webkitfullscreenchange'];
		evts.forEach((e) => document.addEventListener(e, onFs));
		document.addEventListener('click', onDoc);
		return () => {
			evts.forEach((e) => document.removeEventListener(e, onFs));
			document.removeEventListener('click', onDoc);
		};
	});
</script>

<nav
	class="hidden-panel-wrapper"
	class:is-visible={isVisible}
	aria-label="Додаткові налаштування"
	aria-hidden={!isVisible}
>
	<div class="dev-panel-container action-item-wrap" class:is-active={showTooltip}>
		<button
			type="button"
			class="action-item dev-item"
			class:is-active={showTooltip}
			onclick={toggleDevStatus}
			onmouseenter={() => (isHovered = true)}
			onmouseleave={() => (isHovered = false)}
			onfocus={() => (isFocused = true)}
			onblur={() => (isFocused = false)}
			aria-label={devLabel}
			aria-expanded={showTooltip}
			aria-keyshortcuts="i"
		>
			<span class="action-icon-box dev-icon-box">
				<HiddenPanelIcon name="info" />
			</span>
			<span class="action-title dev-title">{devLabel}</span>
		</button>

		<HiddenPanelTooltip show={showTooltip} text={devText} />
	</div>

	<div class="hidden-panel-content">
		<button
			type="button"
			class="action-item"
			onclick={() => settings.toggleTheme()}
			aria-label={isUk ? 'Тема' : 'Theme'}
			aria-keyshortcuts="t"
		>
			<span class="action-icon-box">
				<HiddenPanelIcon name={isDark ? 'sun' : 'moon'} />
			</span>
			<span class="action-title">{isUk ? 'Тема' : 'Theme'}</span>
		</button>

		<button
			type="button"
			class="action-item lang-toggle-item"
			onclick={() => settings.setLocale(settings.locale === 'uk' ? 'en' : 'uk')}
			aria-label={isUk ? 'Мова: Українська' : 'Language: English'}
			aria-keyshortcuts="l"
		>
			<span class="action-icon-box">
				<HiddenPanelIcon name="translate" />
			</span>
			<span class="action-title">{settings.locale.toUpperCase()}</span>
		</button>

		{#if isSupported}
			<button
				type="button"
				class="action-item fullscreen-item"
				onclick={toggleFullscreen}
				aria-label={fsLabel}
				aria-keyshortcuts="f"
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
		z-index: 70;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
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
	.dev-panel-container,
	.hidden-panel-content {
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.76);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		backdrop-filter: blur(20px) saturate(180%);
		border: 1px solid rgba(19, 55, 27, 0.12);
		border-radius: 9999px;
		box-shadow:
			0 16px 40px -10px rgba(19, 55, 27, 0.12),
			0 0 25px rgba(0, 0, 0, 0.03);
	}
	.dev-panel-container {
		padding: 0.65rem 0.85rem;
		transition:
			border-color 0.28s cubic-bezier(0.16, 1, 0.3, 1),
			box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.dev-panel-container:hover,
	.dev-panel-container.is-active {
		border-color: rgba(255, 179, 39, 0.5);
		box-shadow:
			0 0 16px rgba(255, 179, 39, 0.25),
			0 16px 40px -10px rgba(0, 0, 0, 0.5);
		transform: translateY(-2px);
	}
	:global([data-theme='light']) .dev-panel-container:hover,
	:global([data-theme='light']) .dev-panel-container.is-active {
		border-color: rgba(180, 83, 9, 0.4);
		box-shadow:
			0 0 14px rgba(217, 119, 6, 0.2),
			0 16px 40px -10px rgba(19, 55, 27, 0.12);
	}
	.hidden-panel-content {
		gap: 0.35rem;
		padding: 0.65rem 1.15rem;
	}
	:global([data-theme='dark']) .dev-panel-container,
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
		border-radius: 9999px;
		background: transparent;
		border: 1px solid transparent;
		color: #4a634e;
		cursor: pointer;
		font-family: inherit;
		transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
		outline: none;
	}
	:global([data-theme='dark']) .action-item {
		color: #8ea391;
	}
	.action-item:hover {
		color: #0c1c10;
		background: rgba(19, 55, 27, 0.08);
		border-color: rgba(19, 55, 27, 0.2);
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
	.dev-item:hover,
	.dev-item.is-active {
		color: #ffb327;
		background: transparent !important;
		border: 1px solid transparent !important;
		transform: none !important;
	}
	:global([data-theme='light']) .dev-item {
		color: #92400e;
	}
	.dev-title {
		line-height: 1.25;
	}
	.dev-icon-box {
		filter: drop-shadow(0 0 6px rgba(255, 179, 39, 0.5));
	}
	:global([data-theme='light']) .dev-icon-box {
		filter: drop-shadow(0 1px 2px rgba(146, 64, 14, 0.2));
	}
	.dev-item:hover .dev-icon-box,
	.dev-item.is-active .dev-icon-box {
		transform: scale(1.14);
		filter: drop-shadow(0 0 10px rgba(255, 179, 39, 0.9));
	}
	:global([data-theme='light']) .dev-item:hover .dev-icon-box,
	:global([data-theme='light']) .dev-item.is-active .dev-icon-box {
		filter: drop-shadow(0 2px 6px rgba(146, 64, 14, 0.35));
	}
	@media (max-width: 640px) {
		.hidden-panel-wrapper {
			bottom: 0.85rem;
			padding: 0 0.5rem;
			gap: 0.4rem;
		}
		.dev-panel-container {
			padding: 0.45rem 0.5rem;
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
