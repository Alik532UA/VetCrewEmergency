<script lang="ts">
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/utils/withBase';
	import { findArticle } from '$lib/data/library';
	import { REPORT_URL } from '$lib/config';
	import { settings } from '$lib/services/settings.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import HotlineButton from '$lib/components/emergency/HotlineButton.svelte';

	/**
	 * Стаття бібліотеки — вісім блоків у незмінному порядку (див. `LibraryArticle`).
	 *
	 * Коротка відповідь стоїть ПЕРШОЮ й до заголовків: людина читає це з телефона,
	 * стоячи над твариною, і перше речення мусить бути видно без прокрутки.
	 */
	let { data } = $props();

	const lang = $derived(settings.locale);
	const a = $derived(data.article);
	const related = $derived(a.related.map(findArticle).filter((x) => x !== undefined));

	const blocks = $derived([
		{ key: 'library.intervene' as const, text: a.blocks.intervene[lang] },
		{ key: 'library.whenHelp' as const, text: a.blocks.whenHelp[lang] },
		{ key: 'library.never' as const, text: a.blocks.never[lang] },
		{ key: 'library.whenCall' as const, text: a.blocks.whenCall[lang] }
	]);
</script>

<PageMeta title={a.title[lang]} description={a.teaser[lang]} />

<article class="page">
	<Breadcrumbs
		items={[{ label: t('library.title'), href: '/library' }, { label: a.title[lang] }]}
	/>
	<h1 class="page__title"><span aria-hidden="true">{a.emoji}</span> {a.title[lang]}</h1>

	<p class="answer">
		<span class="answer__label">{t('library.answer')}</span>
		{a.answer[lang]}
	</p>

	{#each blocks as block (block.key)}
		<section class="block">
			<h2>{t(block.key)}</h2>
			<p>{block.text}</p>
		</section>
	{/each}

	<section class="block">
		<h2>{t('library.story')}</h2>
		<p>{a.story[lang]}</p>
		<a class="link" href={localePath('/stories', lang)} data-testid="article-story-link">
			{t('stories.all')}
			<Icon name="arrow-right" size="1rem" />
		</a>
	</section>

	{#if related.length > 0}
		<section class="block">
			<h2>{t('library.related')}</h2>
			<ul class="related">
				{#each related as r (r.slug)}
					<li>
						<a href={localePath(`/library/${r.slug}`, lang)} data-testid="article-related-link">
							<span aria-hidden="true">{r.emoji}</span>
							{r.title[lang]}
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<!-- Червона картка зі специфікації: вона стоїть у КІНЦІ кожної статті, бо
		 людина, яка дочитала до кінця, вже зрозуміла, що сама не впорається. -->
	<aside class="red">
		<h2>{t('red.title')}</h2>
		<p>{t('red.text')}</p>
		<div class="red__actions">
			<HotlineButton compact />
			<a
				class="red__cta"
				href={REPORT_URL}
				target="_blank"
				rel="noopener noreferrer"
				data-testid="article-report-btn"
			>
				{t('red.cta')}
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

	.answer__label {
		display: block;
		margin-bottom: 0.2rem;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted);
	}

	.answer {
		margin: 0 0 1rem;
		padding: 1rem 1.25rem;
		border-left: 3px solid var(--color-primary);
		border-radius: var(--radius-md);
		background: var(--color-bg-surface);
		font-size: 1.1rem;
	}

	.block {
		margin-top: 1.75rem;
	}

	.block h2 {
		margin: 0 0 0.4rem;
		font-size: 1.1rem;
	}

	.block p {
		margin: 0;
	}

	.link {
		/* 44px — межа дотику проєкту (`tests/touch-targets.spec.ts`). Рядок короткий,
		   тож без цього мішень виходить удвічі нижчою за палець. */
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-top: 0.5rem;
		font-weight: 600;
		color: var(--color-accent);
		text-decoration: none;
	}
	/* Той самий підпис наведення, що й у решти акцентних посилань сайту. */
	.link:hover {
		text-decoration: underline;
		text-underline-offset: 0.25em;
	}

	.related {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.related a {
		/* 44px — межа дотику проєкту (`tests/touch-targets.spec.ts`). */
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		color: inherit;
	}
	.related a:hover {
		text-decoration: underline;
		text-underline-offset: 0.25em;
	}

	.red {
		margin-top: 2.5rem;
		padding: 1.5rem;
		border-radius: var(--radius-lg);
		background: var(--color-secondary);
		color: var(--color-text-on-secondary);
	}

	.red h2 {
		margin: 0 0 0.4rem;
	}

	.red p {
		margin: 0 0 1rem;
	}

	.red__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
	}

	.red__cta {
		transition:
			background-color var(--transition-fast),
			color var(--transition-fast);
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.6rem 1.1rem;
		border: var(--border-width) solid currentColor;
		border-radius: var(--radius-full);
		color: inherit;
		font-weight: 600;
		text-decoration: none;
	}
	/* Обведення тут іде по currentColor на суцільному червоному, тож наведення
	   міняє не колір, а заповнення: біла пілюля з червоним написом. Це та сама
	   інверсія, якою відповідають кнопки на кольоровій смузі. */
	.red__cta:hover {
		background: var(--color-text-on-secondary);
		color: var(--color-secondary);
	}
</style>
