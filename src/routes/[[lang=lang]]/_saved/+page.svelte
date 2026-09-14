<script lang="ts">
	import { t, tPlural } from '$lib/i18n';
	import { localePath } from '$lib/utils/withBase';
	import { LIBRARY } from '$lib/data/library';
	import { settings } from '$lib/services/settings.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import PageMeta from '$lib/components/PageMeta.svelte';

	/**
	 * Збережені поради.
	 *
	 * Механізм той самий, що був «обраним» у проєкті-джерелі: перелік слагів у
	 * налаштуваннях. Предмет інший — людина зберігає не тварину, а інструкцію,
	 * щоб знайти її за хвилину, коли ситуація повториться.
	 *
	 * Фільтрація йде від РЕЄСТРУ, а не від збереженого переліку: стаття могла
	 * зникнути, і тоді збережений слаг указує в нікуди. У такому разі його
	 * просто не видно — сторінка не показує биту картку й не падає.
	 */
	const lang = $derived(settings.locale);
	const saved = $derived(LIBRARY.filter((a) => settings.favorites.includes(a.slug)));
</script>

<PageMeta title={t('saved.title')} description={t('meta.saved.description')} />

<section class="page">
	<h1 class="page__title">{t('saved.title')}</h1>
	<p class="page__subtitle">
		{t('saved.subtitle')}
		{#if saved.length > 0}<strong>{tPlural('saved.count', saved.length)}</strong>{/if}
	</p>

	{#if saved.length === 0}
		<div class="empty" data-testid="saved-empty-message">
			<p>{t('saved.empty')}</p>
			<a class="empty__link" href={localePath('/library', lang)}>
				{t('saved.toLibrary')}
				<Icon name="arrow-right" size="1rem" />
			</a>
		</div>
	{:else}
		<ul class="cards" data-testid="saved-list">
			{#each saved as a (a.slug)}
				<li class="card">
					<div class="card__head">
						<span class="card__emoji" aria-hidden="true">{a.emoji}</span>
						<h2>{a.title[lang]}</h2>
					</div>
					<p>{a.teaser[lang]}</p>
					<a class="card__link" href={localePath(`/library/${a.slug}`, lang)}>
						{t('library.action')}
						<Icon name="arrow-right" size="1rem" />
					</a>
				</li>
			{/each}
		</ul>
	{/if}
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
		color: var(--color-text-muted);
	}

	.empty {
		padding: 2rem;
		border: var(--border-width) dashed var(--color-border);
		border-radius: var(--radius-lg);
		text-align: center;
	}

	.empty__link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.75rem;
		font-weight: 600;
		color: var(--color-accent);
		text-decoration: none;
	}
	/* Наведення мусить бути видно. Підкреслення, а не зміна кольору: ці посилання вже набрані акцентом, і «золоте на трохи іншому золотому» читається як нічого. */
	.empty__link:hover {
		text-decoration: underline;
		text-underline-offset: 0.25em;
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
		border: var(--border-width) solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-bg-surface);
	}

	.card__head {
		display: flex;
		align-items: center;
		gap: 0.6rem;
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
		margin-left: auto;
		font-weight: 600;
		/* 44px — межа дотику цього проєкту. Посилання коротке, тож без цього воно
		   виходить 26px заввишки: попасти пальцем удвічі важче, ніж прочитати. */
		min-height: 44px;
		color: var(--color-accent);
		text-decoration: none;
	}
	/* Наведення мусить бути видно. Підкреслення, а не зміна кольору: ці посилання вже набрані акцентом, і «золоте на трохи іншому золотому» читається як нічого. */
	.card__link:hover {
		text-decoration: underline;
		text-underline-offset: 0.25em;
	}
</style>
