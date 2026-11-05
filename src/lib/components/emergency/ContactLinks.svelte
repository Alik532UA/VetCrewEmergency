<script lang="ts">
	import { settings } from '$lib/services/settings.svelte';
	import { beaconRuns } from '$lib/utils/twinActions.svelte';
	import { HOTLINE, REPORT_URL } from '$lib/config';

	interface Props {
		isExpanded?: boolean;
		isShiftedUp?: boolean;
	}

	let { isExpanded = false, isShiftedUp = false }: Props = $props();
	let isUk = $derived(settings.locale === 'uk');
	const lit = $derived(settings.beacons !== 'off');
	const runs = $derived(beaconRuns(settings.beacons, 1));

	const channels = $derived([
		{
			id: 'phone',
			name: isUk ? 'Подзвонити' : 'Call Hotline',
			url: `tel:${HOTLINE.tel}`,
			sublabel: isUk ? 'Подзвонити' : 'Call',
			tooltip: HOTLINE.display,
			brandColor: 'var(--beacon-red)',
			brandGlow: 'color-mix(in srgb, var(--beacon-red), transparent 35%)'
		},
		{
			id: 'telegram',
			name: isUk ? 'Написати в Telegram' : 'Message on Telegram',
			url: REPORT_URL,
			sublabel: isUk ? 'Написати' : 'Telegram',
			tooltip: '@alik532',
			brandColor: 'var(--beacon-blue)',
			brandGlow: 'color-mix(in srgb, var(--beacon-blue), transparent 35%)'
		}
	]);
</script>

<div
	class="contact-container"
	class:is-expanded={isExpanded}
	class:is-shifted-up={isShiftedUp}
	style="--beacon-runs: {runs};"
>
	<nav class="contact-links" aria-label="Vet Crew Actions">
		{#each channels as item (item.id)}
			<a
				href={item.url}
				target={item.id === 'telegram' ? '_blank' : undefined}
				rel={item.id === 'telegram' ? 'noopener noreferrer' : undefined}
				class="link-item channel-{item.id}"
				style="--brand-color: {item.brandColor}; --brand-glow: {item.brandGlow};"
				aria-label={item.name}
			>
				<div
					class="icon-wrap"
					class:beacon-a={lit && item.id === 'phone'}
					class:beacon-b={lit && item.id === 'telegram'}
				>
					<svg
						class="contact-icon"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						{#if item.id === 'phone'}
							<path
								d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
							/>
						{:else if item.id === 'telegram'}
							<path d="m22 2-7 20-4-9-9-4Z" />
							<path d="M22 2 11 13" />
						{/if}
					</svg>
				</div>
				<span class="link-sublabel">{item.sublabel}</span>
				<span class="tooltip">{item.tooltip}</span>
			</a>
		{/each}
	</nav>
</div>

<style>
	.contact-container {
		position: fixed;
		bottom: 3.2rem;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		z-index: 20;
		pointer-events: none;
		transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
		will-change: transform;
	}

	.contact-container.is-shifted-up {
		transform: translateY(-90px);
	}

	.contact-links {
		display: grid;
		grid-template-columns: repeat(2, 110px);
		justify-items: center;
		align-items: center;
		padding: 0.25rem 1rem;
		pointer-events: auto;
		transition: grid-template-columns 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.is-expanded .contact-links {
		grid-template-columns: repeat(2, 160px);
	}

	.link-item {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		text-decoration: none;
		outline: none;
	}

	.channel-phone {
		--beacon-glow: color-mix(in srgb, var(--beacon-red), transparent var(--beacon-fade));
	}

	.channel-telegram {
		--beacon-glow: color-mix(in srgb, var(--beacon-blue), transparent var(--beacon-fade));
	}

	.icon-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		padding: 6px;
		color: #4a634e;
		transition:
			transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
			color 0.28s cubic-bezier(0.16, 1, 0.3, 1),
			box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1);
	}

	:global([data-theme='dark']) .icon-wrap {
		color: #a3b8a6;
	}

	.beacon-a {
		animation-name: beacon-a;
		animation-duration: calc(var(--beacon-flash) * 92);
		animation-timing-function: steps(1, end);
		animation-iteration-count: var(--beacon-runs);
	}

	.beacon-b {
		animation-name: beacon-b;
		animation-duration: calc(var(--beacon-flash) * 92);
		animation-timing-function: steps(1, end);
		animation-iteration-count: var(--beacon-runs);
	}

	.contact-links:has(.link-item:hover) .icon-wrap,
	.contact-links:has(.link-item:focus-visible) .icon-wrap {
		animation-play-state: paused;
	}

	.link-item:hover .icon-wrap,
	.link-item:focus-visible .icon-wrap {
		color: var(--brand-color);
		transform: translateY(-4px) scale(1.14);
		animation-play-state: paused;
		box-shadow:
			0 0 0.85rem 0.25rem var(--beacon-glow),
			inset 0 0 0.9rem 0.15rem var(--beacon-glow) !important;
	}

	.contact-icon {
		width: 44px;
		height: 44px;
		display: block;
		transition:
			width 0.45s cubic-bezier(0.16, 1, 0.3, 1),
			height 0.45s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
			filter 0.28s cubic-bezier(0.16, 1, 0.3, 1);
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.12));
	}

	.is-expanded .contact-icon {
		width: 84px;
		height: 84px;
	}

	.link-item:hover .contact-icon,
	.link-item:focus-visible .contact-icon {
		filter: drop-shadow(0 0 18px var(--brand-glow));
	}

	.link-sublabel {
		display: block;
		margin-top: 6px;
		font-size: 0.92rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: #0c1c10;
		opacity: 0;
		max-height: 0;
		overflow: hidden;
		transform: translateY(6px);
		transition:
			opacity 0.4s ease,
			transform 0.4s ease,
			max-height 0.4s ease;
		pointer-events: none;
		white-space: nowrap;
	}

	:global([data-theme='dark']) .link-sublabel {
		color: #f0f4f0;
	}

	.is-expanded .link-sublabel {
		opacity: 1;
		max-height: 28px;
		transform: translateY(0);
	}

	.tooltip {
		position: absolute;
		bottom: calc(100% + 14px);
		padding: 6px 14px;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		white-space: nowrap;
		background: #e6ede6;
		color: #0c1c10;
		border: 1px solid rgba(19, 55, 27, 0.15);
		border-radius: 8px;
		pointer-events: none;
		opacity: 0;
		transform: translateY(6px) scale(0.95);
		transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
		z-index: 60;
	}

	:global([data-theme='dark']) .tooltip {
		background: #19321e;
		color: #f0f4f0;
		border-color: rgba(255, 255, 255, 0.15);
	}

	.is-expanded .tooltip {
		display: none;
	}

	.link-item:hover .tooltip,
	.link-item:focus-visible .tooltip {
		opacity: 1;
		transform: translateY(0) scale(1);
		border-color: var(--brand-color);
	}

	@media (max-width: 640px) {
		.contact-container {
			bottom: 2rem;
		}
		.contact-links {
			grid-template-columns: repeat(2, 88px);
		}
		.is-expanded .contact-links {
			grid-template-columns: repeat(2, 120px);
		}
		.link-item {
			padding: 4px 2px;
			container-type: inline-size;
		}
		.is-expanded .contact-icon {
			width: 60px;
			height: 60px;
		}
		.link-sublabel,
		.is-expanded .link-sublabel {
			font-size: clamp(0.55rem, 2.8vw, 0.85rem);
			font-size: clamp(0.55rem, 9.4cqw, 0.85rem);
			letter-spacing: -0.015em;
			margin-top: 4px;
			width: 100%;
			text-align: center;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: clip;
		}
	}
</style>
