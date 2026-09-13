<script lang="ts">
	import { t } from '$lib/i18n';
	import Icon from '$lib/components/ui/Icon.svelte';

	/**
	 * Чотири випадки, з якими до служби звертаються.
	 *
	 * Ключі перелічені явно, а не складені шаблоном: `t()` приймає лише наявний
	 * ключ, і саме це ловить друкарську помилку в назві. Складений рядок цю
	 * перевірку обходить — промах доїхав би до сторінки як сам ключ.
	 */
	const cases = [
		{ icon: 'paw', title: 'when.injured.title', text: 'when.injured.text' },
		{ icon: 'shield', title: 'when.front.title', text: 'when.front.text' },
		{ icon: 'siren', title: 'when.cruelty.title', text: 'when.cruelty.text' },
		{ icon: 'heart', title: 'when.baby.title', text: 'when.baby.text' }
	] as const;
</script>

<ul class="cards">
	{#each cases as item (item.title)}
		<li class="card">
			<Icon name={item.icon} size="1.5rem" />
			<h3>{t(item.title)}</h3>
			<p>{t(item.text)}</p>
		</li>
	{/each}
</ul>

<style>
	.cards {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr));
		margin: 1.5rem 0 0;
		padding: 0;
		list-style: none;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1.25rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-bg-surface);
	}

	.card h3 {
		margin: 0;
		font-size: 1.05rem;
	}

	.card p {
		margin: 0;
		color: var(--color-text-muted);
	}
</style>
