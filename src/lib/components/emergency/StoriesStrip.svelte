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
			<span class="story__shot" aria-hidden="true">{s.emoji}</span>
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
		transition:
			border-color var(--transition-fast),
			background-color var(--transition-fast);
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		width: clamp(15rem, 13.5rem + 1.5vw, 16.5rem);
		padding: 0.65rem 0.65rem 0.85rem;
		border: var(--border-width) solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-bg-card);
		color: inherit;
		text-decoration: none;
	}
	/* Посилання тут — ціла картка, тож і відповідати на курсор мусить вона ціла, а
	   не рядок «Детальніше» всередині: людина цілиться в картку. */
	.story:hover {
		border-color: var(--color-accent);
		background: var(--color-bg-card-hover);
	}

	/*
	 * Разом із карткою відповідає й рядок «Детальніше».
	 *
	 * Межа й тло картки міняються стримано — навмисно, щоб ряд карток не миготів
	 * під курсором, — але око шукає підтвердження саме на тому слові, яке читає як
	 * посилання. Підкреслення те саме, що в решти акцентних посилань сайту.
	 */
	.story:hover .story__more {
		text-decoration: underline;
		text-underline-offset: 0.25em;
	}

	/* Місце знімка. Пропорція задана тут, а не змістом: із нею картки стоять на
	   одній висоті ще до того, як з'являться самі фотографії. */
	.story__shot {
		display: grid;
		place-items: center;
		margin-bottom: 0.35rem;
		aspect-ratio: 16 / 9;
		border-radius: var(--radius-md);
		background: var(--gradient-hero);
		font-size: 2.25rem;
	}

	.story h3 {
		margin: 0;
		padding: 0 0.4rem;
		font-size: clamp(0.92rem, 0.86rem + 0.1vw, 1rem);
		line-height: 1.25;
	}

	.story p {
		margin: 0;
		padding: 0 0.4rem;
		font-size: clamp(0.78rem, 0.72rem + 0.15vw, 0.86rem);
		line-height: 1.38;
		color: var(--color-text-muted);
	}

	.story__more {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-top: auto;
		margin-left: auto;
		padding: 0.4rem 0.4rem 0;
		font-weight: 600;
		color: var(--color-accent);
	}
</style>
