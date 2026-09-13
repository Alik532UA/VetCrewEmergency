<script lang="ts">
	import { t } from '$lib/i18n';

	/**
	 * Кого рятуємо — п'ять кружків із підписами.
	 *
	 * У референсі це знімки видів у круглих рамках. Знімків немає — у матеріалах
	 * автора їх не було, — тож у кружках стоять емодзі. Рамка при цьому лишається
	 * такою самою, як буде зі знімком: коли фотографії з'являться, зміниться
	 * вміст кружка, а не розкладка ряду.
	 */
	const species = [
		{ key: 'species.birds', emoji: '🦉' },
		{ key: 'species.largeMammals', emoji: '🦌' },
		{ key: 'species.smallMammals', emoji: '🦔' },
		{ key: 'species.reptiles', emoji: '🐢' },
		{ key: 'species.amphibians', emoji: '🐸' }
	] as const;
</script>

<ul class="species">
	{#each species as s (s.key)}
		<li class="species__item">
			<span class="species__disc" aria-hidden="true">{s.emoji}</span>
			<span class="species__name">{t(s.key)}</span>
		</li>
	{/each}
</ul>

<style>
	.species {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(min(8rem, 100%), 1fr));
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.species__item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
		text-align: center;
	}

	.species__disc {
		display: grid;
		place-items: center;
		width: 100%;
		max-width: 8.5rem;
		aspect-ratio: 1;
		border: var(--border-width) solid var(--color-border);
		border-radius: 50%;
		background: var(--gradient-hero);
		font-size: 2.75rem;
	}

	.species__name {
		font-weight: 600;
	}
</style>
