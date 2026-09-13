<script lang="ts">
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/utils/withBase';
	import { LIBRARY } from '$lib/data/library';
	import { settings } from '$lib/services/settings.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import PageMeta from '$lib/components/PageMeta.svelte';

	/**
	 * Уся бібліотека одним переліком, без фільтрів і пошуку.
	 *
	 * Статей десять. Пошук по десятьох картках коштує людині більше, ніж дає:
	 * очима цей перелік читається швидше, ніж набирається запит. Фільтри
	 * з'являться тоді, коли з'явиться що фільтрувати.
	 */
	const lang = $derived(settings.locale);
</script>

<PageMeta title={t('library.title')} description={t('meta.library.description')} />

<section class="page">
	<h1 class="page__title">{t('library.title')}</h1>
	<p class="page__subtitle">{t('library.subtitle')}</p>

	<ul class="cards" data-testid="library-list">
		{#each LIBRARY as a (a.slug)}
			<li class="card">
				<span class="card__emoji" aria-hidden="true">{a.emoji}</span>
				<h2>{a.title[lang]}</h2>
				<p>{a.teaser[lang]}</p>
				<a class="card__link" href={localePath(`/library/${a.slug}`, lang)}>
					{t('library.action')}
					<Icon name="arrow-right" size="1rem" />
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	.page {
		max-width: 68rem;
		margin: 0 auto;
		padding: clamp(1.5rem, 4vw, 3rem) 1rem;
	}

	.page__title {
		margin: 0;
		font-size: clamp(1.6rem, 4vw, 2.5rem);
		text-transform: uppercase;
	}

	.page__subtitle {
		margin: 0.35rem 0 1.5rem;
		max-width: 52rem;
		color: var(--color-text-muted);
	}

	.cards {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
		margin: 0;
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

	.card h2 {
		margin: 0;
		font-size: 1.05rem;
	}

	.card p {
		margin: 0;
		color: var(--color-text-muted);
	}

	.card__emoji {
		font-size: 1.75rem;
	}

	.card__link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-top: auto;
		font-weight: 600;
		color: var(--color-primary);
		text-decoration: none;
	}
</style>
