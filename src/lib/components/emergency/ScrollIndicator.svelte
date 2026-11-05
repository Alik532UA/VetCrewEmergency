<script lang="ts">
	interface Props {
		state: 1 | 2 | 3;
		onGoToState: (state: 1 | 2 | 3) => void;
	}

	let { state, onGoToState }: Props = $props();
	const dots = [1, 2, 3] as const;
</script>

<aside class="scroll-indicator" aria-label="Індикатор стану скролу">
	{#each dots as dot (dot)}
		<button
			type="button"
			class="state-dot"
			class:active={state === dot}
			onclick={() => onGoToState(dot)}
			aria-label="Slide {dot}"
			title="Slide {dot}"
		>
			<span class="dot-inner"></span>
		</button>
	{/each}
</aside>

<style>
	.scroll-indicator {
		position: fixed;
		right: 1.5rem;
		top: 50%;
		transform: translateY(-50%);
		z-index: 60;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		padding: 0.6rem 0.4rem;
		background: rgba(255, 255, 255, 0.76);
		-webkit-backdrop-filter: blur(12px);
		backdrop-filter: blur(12px);
		border-radius: 9999px;
		border: 1px solid rgba(19, 55, 27, 0.12);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
		transition: opacity 0.28s ease-out;
	}

	:global([data-theme='dark']) .scroll-indicator {
		background: rgba(19, 35, 22, 0.82);
		border-color: rgba(255, 255, 255, 0.12);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
	}

	.state-dot {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	.dot-inner {
		width: 7px;
		height: 7px;
		border-radius: 9999px;
		background: #4a634e;
		opacity: 0.45;
		transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}

	:global([data-theme='dark']) .dot-inner {
		background: #8ea391;
	}

	.state-dot:hover .dot-inner {
		opacity: 0.9;
		transform: scale(1.3);
	}

	.state-dot.active .dot-inner {
		width: 8px;
		height: 20px;
		opacity: 1;
		background: linear-gradient(180deg, #ffb327 0%, #598f3a 100%);
		box-shadow: 0 0 12px rgba(255, 179, 39, 0.5);
	}

	@media (max-width: 768px), (pointer: coarse) {
		.scroll-indicator {
			right: 0.75rem;
		}
	}
</style>
