<script lang="ts">
	interface Props {
		/** `id` заголовка — на нього вказує `aria-labelledby` самого розділу. */
		id: string;
		title: string;
		subtitle?: string;
	}

	let { id, title, subtitle }: Props = $props();
</script>

<header class="head">
	<h2 class="head__title" {id}>{title}</h2>
	{#if subtitle}
		<p class="head__subtitle">{subtitle}</p>
	{/if}
</header>

<style>
	.head {
		margin-bottom: 0.5rem;
	}

	.head__title {
		margin: 0;
		font-size: clamp(1.4rem, 3.5vw, 2.25rem);
		text-transform: uppercase;
	}

	.head__subtitle {
		margin: 0.35rem 0 0;
		color: var(--color-text-muted);
	}
</style>
