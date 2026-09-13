<script lang="ts">
	import { t } from '$lib/i18n';
	import { CONTACT_EMAIL, ADDRESS } from '$lib/config';
	import { settings } from '$lib/services/settings.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import PageMeta from '$lib/components/PageMeta.svelte';
	import HotlineButton from '$lib/components/emergency/HotlineButton.svelte';
	import { handleEmailClick } from '$lib/utils/emailAction';

	const lang = $derived(settings.locale);

	const features = [
		{ title: 'about.f1.title', text: 'about.f1.text' },
		{ title: 'about.f2.title', text: 'about.f2.text' },
		{ title: 'about.f3.title', text: 'about.f3.text' },
		{ title: 'about.f4.title', text: 'about.f4.text' },
		{ title: 'about.f5.title', text: 'about.f5.text' },
		{ title: 'about.f6.title', text: 'about.f6.text' }
	] as const;
</script>

<PageMeta title={t('about.title')} description={t('meta.about.description')} />

<section class="page">
	<h1 class="page__title">{t('about.title')}</h1>
	<p class="page__lead">{t('about.lead')}</p>

	<ul class="cards">
		{#each features as f (f.title)}
			<li>
				<h2>{t(f.title)}</h2>
				<p>{t(f.text)}</p>
			</li>
		{/each}
	</ul>

	<p class="honest">
		<strong>{t('about.honest.title')}</strong>
		{t('about.honest.text')}
	</p>

	<h2 class="contacts__title">{t('footer.contacts')}</h2>
	<ul class="contacts" data-testid="about-contacts-list">
		<li><Icon name="map-pin" size="1rem" /> {ADDRESS[lang]}</li>
		<li>
			<Icon name="email" size="1rem" />
			<a
				href="mailto:{CONTACT_EMAIL.rescue}"
				onclick={(event) => handleEmailClick(event, CONTACT_EMAIL.rescue)}>{CONTACT_EMAIL.rescue}</a
			>
		</li>
	</ul>

	<HotlineButton />
</section>

<style>
	.page {
		max-width: 52rem;
		margin: 0 auto;
		padding: clamp(1.5rem, 4vw, 3rem) 1rem;
	}

	.page__title {
		margin: 0 0 0.5rem;
		font-size: clamp(1.6rem, 4vw, 2.5rem);
		text-transform: uppercase;
	}

	.page__lead {
		margin: 0 0 1.5rem;
		color: var(--color-text-muted);
	}

	.cards {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
		margin: 0 0 1.5rem;
		padding: 0;
		list-style: none;
	}

	.cards li {
		padding: 1.25rem;
		border: var(--border-width) solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-bg-surface);
	}

	.cards h2 {
		margin: 0 0 0.35rem;
		font-size: 1.05rem;
	}

	.cards p {
		margin: 0;
		color: var(--color-text-muted);
	}

	.honest {
		padding: 1rem 1.25rem;
		border-left: 3px solid var(--color-primary);
		background: var(--color-bg-surface);
	}

	.contacts__title {
		margin: 2rem 0 0.5rem;
		font-size: 1.15rem;
	}

	.contacts {
		margin: 0 0 1.5rem;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.contacts li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
