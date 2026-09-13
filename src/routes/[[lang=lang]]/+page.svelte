<script lang="ts">
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/utils/withBase';
	import { LIBRARY_FEATURED } from '$lib/data/library';
	import { settings } from '$lib/services/settings.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import PageMeta from '$lib/components/PageMeta.svelte';
	import HotlineButton from '$lib/components/emergency/HotlineButton.svelte';
	import SectionHead from '$lib/components/emergency/SectionHead.svelte';
	import WhenToCall from '$lib/components/emergency/WhenToCall.svelte';
	import StoriesStrip from '$lib/components/emergency/StoriesStrip.svelte';

	/**
	 * Головна — одна довга сторінка з дев'яти розділів, у порядку зі
	 * специфікації автора.
	 *
	 * Порядок тут не композиційний, а за терміновістю. Перший екран відповідає
	 * на єдине питання людини, яка щойно знайшла поранену тварину: «кому
	 * дзвонити». Усе інше — хто ми, як це працює, кого врятували — стоїть нижче,
	 * бо в ту мить не має значення.
	 *
	 * Тому номер гарячої лінії з'являється двічі: у шапці й у підвалі. Це не
	 * дублювання з недогляду — людина, яка прокрутила сторінку до кінця, не
	 * мусить вертатися нагору.
	 */

	const lang = $derived(settings.locale);

	const steps = [
		{ title: 'how.step1.title', text: 'how.step1.text' },
		{ title: 'how.step2.title', text: 'how.step2.text' },
		{ title: 'how.step3.title', text: 'how.step3.text' },
		{ title: 'how.step4.title', text: 'how.step4.text' },
		{ title: 'how.step5.title', text: 'how.step5.text' }
	] as const;

	const species = [
		{ key: 'species.birds', emoji: '🦉' },
		{ key: 'species.largeMammals', emoji: '🦌' },
		{ key: 'species.smallMammals', emoji: '🦔' },
		{ key: 'species.reptiles', emoji: '🐢' },
		{ key: 'species.amphibians', emoji: '🐸' }
	] as const;

	const features = [
		{ title: 'about.f1.title', text: 'about.f1.text' },
		{ title: 'about.f2.title', text: 'about.f2.text' },
		{ title: 'about.f3.title', text: 'about.f3.text' },
		{ title: 'about.f4.title', text: 'about.f4.text' },
		{ title: 'about.f5.title', text: 'about.f5.text' },
		{ title: 'about.f6.title', text: 'about.f6.text' }
	] as const;
	const journey = [
		{ title: 'journey.s1.title', text: 'journey.s1.text' },
		{ title: 'journey.s2.title', text: 'journey.s2.text' },
		{ title: 'journey.s3.title', text: 'journey.s3.text' },
		{ title: 'journey.s4.title', text: 'journey.s4.text' },
		{ title: 'journey.s5.title', text: 'journey.s5.text' }
	] as const;
</script>

<PageMeta
	title="{t('app.title.full')} — {t('app.tagline')}"
	description={t('meta.home.description')}
/>

<!-- 1 — hero -->
<section class="hero" aria-labelledby="hero-title">
	<div class="hero__inner">
		<h1 class="hero__title" id="hero-title">
			<span>{t('hero.title.1')}</span>
			<span class="hero__accent">{t('hero.title.2')}</span>
			<span>{t('hero.title.3')}</span>
		</h1>
		<p class="hero__tagline">{t('app.tagline')}</p>
		<p class="hero__text">{t('hero.text')}</p>

		<div class="hero__actions">
			<HotlineButton />
			<a class="hero__report" href={localePath('/report', lang)} data-testid="hero-report-link">
				<Icon name="map-pin" size="1.25rem" />
				<span>
					<strong>{t('hero.report')}</strong>
					<small>{t('hero.reportHint')}</small>
				</span>
			</a>
		</div>

		<p class="hero__pending">{t('hotline.placeholder')}</p>

		<p class="hero__area"><Icon name="map-pin" size="1rem" /> {t('hero.area')}</p>

		<p class="hero__species-label">{t('hero.species')}</p>
		<ul class="hero__species">
			{#each species as s (s.key)}
				<li><span aria-hidden="true">{s.emoji}</span> {t(s.key)}</li>
			{/each}
		</ul>
	</div>
</section>

<!-- 2 — коли до нас можна звертатися -->
<section class="band" id="when" aria-labelledby="when-title">
	<SectionHead id="when-title" title={t('when.title')} />
	<WhenToCall />
</section>

<!-- 3 — як відбувається порятунок -->
<section class="band" id="how" aria-labelledby="how-title">
	<SectionHead id="how-title" title={t('how.title')} />
	<ol class="steps">
		{#each steps as step, i (step.title)}
			<li class="step">
				<span class="step__num" aria-hidden="true">{i + 1}</span>
				<h3>{t(step.title)}</h3>
				<p>{t(step.text)}</p>
			</li>
		{/each}
	</ol>
</section>

<!-- 4 — бібліотека -->
<section class="band" id="library" aria-labelledby="library-title">
	<SectionHead id="library-title" title={t('library.title')} subtitle={t('library.subtitle')} />
	<ul class="cards cards--4" data-testid="library-featured-list">
		{#each LIBRARY_FEATURED as a (a.slug)}
			<li class="card">
				<span class="card__emoji" aria-hidden="true">{a.emoji}</span>
				<h3>{a.title[lang]}</h3>
				<p>{a.teaser[lang]}</p>
				<a
					class="card__link"
					href={localePath(`/library/${a.slug}`, lang)}
					data-testid="library-card-link"
				>
					{t('library.action')}
					<Icon name="arrow-right" size="1rem" />
				</a>
			</li>
		{/each}
	</ul>
	<a class="band__all" href={localePath('/library', lang)}>
		{t('library.all')}
		<Icon name="arrow-right" size="1rem" />
	</a>
</section>

<!-- 5 — про нас -->
<section class="band" id="about" aria-labelledby="about-title">
	<SectionHead id="about-title" title={t('about.title')} />
	<p class="band__lead">{t('about.lead')}</p>
	<a class="band__all" href={localePath('/about', lang)}>
		{t('about.more')}
		<Icon name="arrow-right" size="1rem" />
	</a>
	<ul class="cards cards--3">
		{#each features as f (f.title)}
			<li class="card card--plain">
				<h3>{t(f.title)}</h3>
				<p>{t(f.text)}</p>
			</li>
		{/each}
	</ul>
	<p class="band__honest">
		<strong>{t('about.honest.title')}</strong>
		{t('about.honest.text')}
	</p>
</section>

<!-- 6 — шлях тварини -->
<section class="band" id="journey" aria-labelledby="journey-title">
	<SectionHead id="journey-title" title={t('journey.title')} />
	<ol class="journey">
		{#each journey as s (s.title)}
			<li>
				<h3>{t(s.title)}</h3>
				<p>{t(s.text)}</p>
			</li>
		{/each}
	</ol>
</section>

<!-- 7 — наші напрямки -->
<section class="band" id="directions" aria-labelledby="directions-title">
	<SectionHead
		id="directions-title"
		title={t('directions.title')}
		subtitle={t('directions.subtitle')}
	/>
	<p class="band__lead">{t('directions.lead')}</p>
	<ul class="cards cards--3">
		<li class="card card--current">
			<Icon name="siren" size="1.5rem" />
			<h3>{t('app.title.full')}</h3>
			<p class="card__tagline">{t('app.tagline')}</p>
			<p>{t('directions.emergency.text')}</p>
		</li>
		<li class="card">
			<Icon name="stethoscope" size="1.5rem" />
			<h3>Vet Crew Hospital</h3>
			<p class="card__tagline">{t('directions.hospital.tagline')}</p>
			<p>{t('directions.hospital.text')}</p>
			<span class="card__soon">{t('directions.soon')}</span>
		</li>
		<li class="card">
			<Icon name="shield" size="1.5rem" />
			<h3>Vet Crew Sanctuary</h3>
			<p class="card__tagline">{t('directions.sanctuary.tagline')}</p>
			<p>{t('directions.sanctuary.text')}</p>
			<span class="card__soon">{t('directions.soon')}</span>
		</li>
	</ul>
</section>

<!-- 8 — історії порятунку -->
<section class="band" id="stories" aria-labelledby="stories-title">
	<SectionHead id="stories-title" title={t('stories.title')} subtitle={t('stories.counter')} />
	<p class="band__lead">{t('stories.lead')}</p>
	<StoriesStrip />
	<a class="band__all" href={localePath('/stories', lang)}>
		{t('stories.all')}
		<Icon name="arrow-right" size="1rem" />
	</a>
</section>

<!-- 9 — підтримка проєкту -->
<section class="band band--support" id="support" aria-labelledby="support-title">
	<SectionHead id="support-title" title={t('support.title')} subtitle={t('support.subtitle')} />
	<p class="band__lead">{t('support.text')}</p>
	<a class="band__cta" href={localePath('/support', lang)} data-testid="home-support-link">
		{t('support.donate')}
		<Icon name="arrow-right" size="1rem" />
	</a>
</section>

<style>
	.hero {
		padding: clamp(2rem, 6vw, 5rem) 0 clamp(2rem, 5vw, 4rem);
	}

	.hero__inner {
		max-width: 62rem;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.hero__title {
		display: flex;
		flex-direction: column;
		gap: 0.15em;
		margin: 0 0 0.5rem;
		font-size: clamp(2rem, 6vw, 3.75rem);
		line-height: 1.05;
		text-transform: uppercase;
	}

	.hero__accent {
		color: var(--color-primary);
	}

	.hero__tagline {
		margin: 0 0 1.25rem;
		font-weight: 700;
		color: var(--color-text-muted);
	}

	.hero__text {
		max-width: 46rem;
		margin: 0 0 1.75rem;
	}

	.hero__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.hero__report {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.9rem 1.4rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-bg-surface);
		color: inherit;
		text-decoration: none;
	}

	.hero__report span {
		display: flex;
		flex-direction: column;
	}

	.hero__report small {
		color: var(--color-text-muted);
	}

	.hero__pending {
		margin: 0 0 1rem;
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}

	.hero__area,
	.hero__species-label {
		color: var(--color-text-muted);
		max-width: 46rem;
	}

	.hero__species {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.5rem;
		margin: 0.5rem 0 0;
		padding: 0;
		list-style: none;
	}

	.band {
		max-width: 68rem;
		margin: 0 auto;
		padding: clamp(2rem, 5vw, 3.5rem) 1rem;
	}

	.band__lead {
		max-width: 52rem;
		color: var(--color-text-muted);
	}

	.band__honest {
		max-width: 52rem;
		margin-top: 1.5rem;
		padding: 1rem 1.25rem;
		border-left: 3px solid var(--color-primary);
		background: var(--color-bg-surface);
	}

	.band__all,
	.band__cta {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 1rem;
		font-weight: 600;
		color: var(--color-primary);
		text-decoration: none;
	}

	.band__cta {
		padding: 0.85rem 1.5rem;
		border-radius: var(--radius-full);
		background: var(--color-primary);
		color: var(--color-text-on-accent);
	}

	.cards {
		display: grid;
		gap: 1rem;
		margin: 1.5rem 0 0;
		padding: 0;
		list-style: none;
	}

	/* `auto-fit` замість фіксованої кількості колонок: карток у розділах різна
	   кількість (чотири, три, сім), і окреме правило для кожного розійшлося б із
	   даними на першій же доданій картці. */
	.cards--3,
	.cards--4 {
		grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr));
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

	.card--plain {
		background: none;
	}

	.card--current {
		border-color: var(--color-primary);
	}

	.card h3 {
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

	.card__tagline {
		font-weight: 600;
		color: var(--color-text) !important;
	}

	.card__soon {
		margin-top: auto;
		font-size: 0.85rem;
		color: var(--color-text-muted);
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

	.steps,
	.journey {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(min(14rem, 100%), 1fr));
		margin: 1.5rem 0 0;
		padding: 0;
		list-style: none;
		counter-reset: step;
	}

	.step,
	.journey li {
		padding: 1.25rem;
		border-radius: var(--radius-lg);
		background: var(--color-bg-surface);
	}

	.step__num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		background: var(--color-primary);
		color: var(--color-text-on-accent);
		font-weight: 700;
	}

	.step h3,
	.journey h3 {
		margin: 0.5rem 0 0.25rem;
		font-size: 1rem;
	}

	.step p,
	.journey p {
		margin: 0;
		color: var(--color-text-muted);
	}
</style>
