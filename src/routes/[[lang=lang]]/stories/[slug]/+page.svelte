<script lang="ts">
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/utils/withBase';
	import { settings } from '$lib/services/settings.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import HotlineButton from '$lib/components/emergency/HotlineButton.svelte';

	/**
	 * Сторінка історії.
	 *
	 * Показує рівно те, що є. Повних текстів у матеріалах ще немає, і сторінка
	 * каже про це прямо, замість того щоб розтягувати абзац на екран пустими
	 * словами: це розповідь про конкретну тварину й конкретних людей, і вигадана
	 * подробиця тут була б неправдою про чужу роботу.
	 */
	let { data } = $props();

	const lang = $derived(settings.locale);
	const s = $derived(data.story);
</script>

<PageMeta title={s.title[lang]} description={s.summary[lang]} />

<article class="page">
	<Breadcrumbs
		items={[{ label: t('stories.title'), href: '/stories' }, { label: s.title[lang] }]}
	/>
	<h1 class="page__title"><span aria-hidden="true">{s.emoji}</span> {s.title[lang]}</h1>

	<p class="lead">{s.summary[lang]}</p>

	{#each s.body as paragraph (paragraph[lang])}
		<p>{paragraph[lang]}</p>
	{/each}

	{#if s.body.length === 0}
		<p class="pending">{t('stories.pending')}</p>
	{/if}

	<a class="link" href={localePath('/stories', lang)}>
		<Icon name="arrow-left" size="1rem" />
		{t('stories.all')}
	</a>

	<aside class="red">
		<h2>{t('support.title')}</h2>
		<p>{t('support.text')}</p>
		<div class="red__actions">
			<HotlineButton compact />
			<a class="red__cta" href={localePath('/support', lang)}>
				{t('support.donate')}
				<Icon name="arrow-right" size="1rem" />
			</a>
		</div>
	</aside>
</article>

<style>
	.page {
		max-width: 46rem;
		margin: 0 auto;
		padding: clamp(1.5rem, 4vw, 3rem) 1rem;
	}

	.page__title {
		margin: 0.25rem 0 1rem;
		font-size: clamp(1.5rem, 4vw, 2.25rem);
	}

	.lead {
		font-size: 1.1rem;
	}

	.pending {
		padding: 1rem 1.25rem;
		border: 1px dashed var(--color-border);
		border-radius: var(--radius-md);
		color: var(--color-text-muted);
	}

	.link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-top: 1rem;
		font-weight: 600;
		color: var(--color-primary);
		text-decoration: none;
	}

	.red {
		margin-top: 2.5rem;
		padding: 1.5rem;
		border-radius: var(--radius-lg);
		background: var(--color-bg-surface);
	}

	.red h2 {
		margin: 0 0 0.4rem;
	}

	.red__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
		margin-top: 1rem;
	}

	.red__cta {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.6rem 1.1rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
		color: inherit;
		font-weight: 600;
		text-decoration: none;
	}
</style>
