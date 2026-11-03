<script lang="ts">
	import { fade } from 'svelte/transition';

	interface Props {
		show?: boolean;
		text: string;
	}

	let { show = false, text }: Props = $props();
</script>

{#if show}
	<div class="dev-capsule-tooltip" role="status" transition:fade={{ duration: 160 }}>
		<span class="dev-capsule-text">{text}</span>
	</div>
{/if}

<style>
	.dev-capsule-tooltip {
		position: absolute;
		bottom: calc(100% + 14px);
		left: 50%;
		transform: translateX(-50%);
		padding: 0.55rem 1.15rem;
		background: rgba(12, 22, 14, 0.94);
		backdrop-filter: blur(20px) saturate(180%);
		border: 1px solid rgba(255, 179, 39, 0.85);
		border-radius: 10px;
		box-shadow:
			0 0 14px rgba(255, 179, 39, 0.25),
			0 8px 24px rgba(0, 0, 0, 0.55);
		z-index: 100;
		pointer-events: none;
		white-space: nowrap;
	}
	:global([data-theme='light']) .dev-capsule-tooltip {
		background: rgba(255, 255, 255, 0.96);
		border-color: #d97706;
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
		.dev-capsule-tooltip {
			white-space: normal;
			text-align: center;
			width: max-content;
			max-width: 260px;
			font-size: 0.78rem;
			padding: 0.45rem 0.85rem;
			bottom: calc(100% + 10px);
		}
		.dev-capsule-text {
			font-size: 0.78rem;
		}
	}
</style>
