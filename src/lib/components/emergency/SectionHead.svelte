<script lang="ts">
	interface Props {
		/** `id` заголовка — на нього вказує `aria-labelledby` самого розділу. */
		id: string;
		title: string;
		subtitle?: string;
		/**
		 * Заголовок посередині — для розділів, які самі є симетричним рядом
		 * (кружки кроків, ланцюжок етапів). Ліве вирівнювання над симетричним
		 * рядом читається як помилка складання, а не як рішення.
		 */
		center?: boolean;
	}

	let { id, title, subtitle, center = false }: Props = $props();
</script>

<header class="head" class:head--center={center}>
	<h2 class="head__title" {id}>{title}</h2>
	{#if subtitle}
		<p class="head__subtitle">{subtitle}</p>
	{/if}
</header>

<style>
	.head {
		margin-bottom: 0.5rem;
	}

	.head--center {
		text-align: center;
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
