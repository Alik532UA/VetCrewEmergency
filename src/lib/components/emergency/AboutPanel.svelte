<script lang="ts">
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/utils/withBase';
	import { settings } from '$lib/services/settings.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	interface Props {
		/** `id` заголовка — на нього вказує `aria-labelledby` самого розділу. */
		id: string;
	}

	let { id }: Props = $props();

	/**
	 * «Про нас» — панель на дві колонки: заява ліворуч, шість переваг праворуч.
	 *
	 * Заголовком розділу лишається «Про нас», хоч великим кеглем набрано інший
	 * рядок. Так у референсі, і так правильно: `aria-labelledby` дає розділу ім'я
	 * для переліку заголовків, а «Ми ніколи не обіцяємо дива» — це теза, а не
	 * назва розділу. Помінявши їх місцями, ми отримали б сторінку, у змісті якої
	 * немає слова «Про нас».
	 *
	 * Тезою стоїть саме та фраза, що найменше схожа на рекламу. Вона з матеріалів
	 * автора й тримає весь тон сайту: люди приходять сюди з твариною в критичному
	 * стані, і обіцянка порятунку була б неправдою в найгіршу мить.
	 */
	const features = [
		{ icon: 'team', title: 'about.f1.title', text: 'about.f1.text' },
		{ icon: 'stethoscope', title: 'about.f2.title', text: 'about.f2.text' },
		{ icon: 'map-pin', title: 'about.f3.title', text: 'about.f3.text' },
		{ icon: 'science', title: 'about.f4.title', text: 'about.f4.text' },
		{ icon: 'home', title: 'about.f5.title', text: 'about.f5.text' },
		{ icon: 'globe', title: 'about.f6.title', text: 'about.f6.text' }
	] as const;

	const lang = $derived(settings.locale);
</script>

<div class="about panel">
	<div class="about__lead">
		<h2 class="about__eyebrow" {id}>{t('about.title')}</h2>
		<p class="about__claim">{t('about.honest.title')}</p>
		<p class="about__text">{t('about.lead')}</p>
		<p class="about__text about__text--muted">{t('about.honest.text')}</p>
		<a class="about__more" href={localePath('/about', lang)}>
			{t('about.more')}
			<Icon name="arrow-right" size="1rem" />
		</a>
	</div>

	<ul class="features">
		{#each features as f (f.title)}
			<li class="feature">
				<span class="feature__icon" aria-hidden="true"><Icon name={f.icon} size="1.35rem" /></span>
				<h3 class="feature__title">{t(f.title)}</h3>
				<p class="feature__text">{t(f.text)}</p>
			</li>
		{/each}
	</ul>
</div>

<style>
	/*
	 * Єдина панель сторінки, світліша за решту, — і це з референсу.
	 *
	 * Там усі розділи стоять на майже чорному, а «Про нас» лежить на теплішому
	 * оливковому прямокутнику: це найдовший суцільний текст на сторінці, і
	 * власний відтінок відділяє його від рядів карток вище й нижче. Бере
	 * --color-bg-warm — токен рівно для цього й існує.
	 */
	.about {
		display: grid;
		gap: clamp(1.5rem, 4vw, 3rem);
		/* 20rem, а не 15rem, як у решти сіток: ліва колонка несе суцільний абзац,
		   і на вужчій вона розсипається на рядки по три слова. */
		grid-template-columns: repeat(auto-fit, minmax(min(20rem, 100%), 1fr));
		background: var(--color-bg-warm);
	}

	.about__eyebrow {
		margin: 0 0 0.5rem;
		font-size: 0.95rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-accent);
	}

	.about__claim {
		margin: 0 0 1rem;
		font-size: clamp(1.35rem, 2.6vw, 1.9rem);
		font-weight: 700;
		line-height: 1.15;
	}

	.about__text {
		margin: 0 0 1rem;
	}

	.about__text--muted {
		color: var(--color-text-muted);
	}

	.about__more {
		transition:
			border-color var(--transition-fast),
			color var(--transition-fast);
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.6rem 1.2rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
		color: inherit;
		font-weight: 600;
		text-decoration: none;
	}

	/* Це обведена кнопка, а не рядок тексту, тож наведення бере межу й напис, а не
	   підкреслення: риска під написом усередині пілюлі читається як помилка. */
	.about__more:hover {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}

	.features {
		display: grid;
		gap: 1.25rem;
		grid-template-columns: repeat(auto-fit, minmax(min(13rem, 100%), 1fr));
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.feature__icon {
		display: inline-flex;
		color: var(--color-accent);
	}

	.feature__title {
		margin: 0.35rem 0 0.25rem;
		font-size: 0.95rem;
		color: var(--color-accent);
	}

	.feature__text {
		margin: 0;
		font-size: 0.9rem;
		color: var(--color-text-muted);
	}
</style>
