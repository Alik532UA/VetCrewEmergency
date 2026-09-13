<script lang="ts">
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/utils/withBase';
	import { STORIES } from '$lib/data/stories';
	import { settings } from '$lib/services/settings.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Carousel from '$lib/components/ui/Carousel.svelte';

	/**
	 * Історії порятунку на головній — стрічкою, що їде сама.
	 *
	 * Каруселлю, а не сіткою, і це з дизайн-референсу: історій сім, сіткою вони
	 * забирають екран, а мета розділу — показати, що їх БАГАТО, а не дати
	 * прочитати всі сім тут-таки. Хто захоче читати — піде в перелік.
	 *
	 * Винесено з головної окремим компонентом, бо там сторінка впиралася в
	 * стелю § 7, а цей розділ — єдиний, у якого є власна поведінка.
	 */
	const lang = $derived(settings.locale);
</script>

<Carousel testId="stories-carousel">
	{#each STORIES as s (s.slug)}
		<a class="story" href={localePath(`/stories/${s.slug}`, lang)}>
			<span class="story__emoji" aria-hidden="true">{s.emoji}</span>
			<h3>{s.title[lang]}</h3>
			<p>{s.summary[lang]}</p>
			<span class="story__more">
				{t('stories.more')}
				<Icon name="arrow-right" size="1rem" />
			</span>
		</a>
	{/each}
</Carousel>

<style>
	.story {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		width: 17rem;
		padding: 1.25rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-bg-surface);
		color: inherit;
		text-decoration: none;
	}

	.story__emoji {
		font-size: 1.75rem;
	}

	.story h3 {
		margin: 0;
		font-size: 1.05rem;
	}

	.story p {
		margin: 0;
		color: var(--color-text-muted);
	}

	.story__more {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-top: auto;
		font-weight: 600;
		color: var(--color-primary-on-surface);
	}
</style>
