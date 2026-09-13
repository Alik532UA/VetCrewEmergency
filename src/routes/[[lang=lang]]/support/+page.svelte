<script lang="ts">
	import { t } from '$lib/i18n';
	import Icon from '$lib/components/ui/Icon.svelte';
	import PageMeta from '$lib/components/PageMeta.svelte';

	/**
	 * Підтримка проєкту.
	 *
	 * Кнопки поки нікуди не ведуть, і це видно: адрес пожертви й крамниці в
	 * матеріалах немає. Кнопка, яка веде в нікуди, гірша за кнопку, яка чесно
	 * каже «посилання буде» — перша виглядає як поламаний сайт.
	 */
</script>

<PageMeta title={t('support.title')} description={t('meta.support.description')} />

<section class="page">
	<h1 class="page__title">{t('support.title')}</h1>
	<p class="subtitle">{t('support.subtitle')}</p>
	<p class="page__lead">{t('support.text')}</p>

	<div class="block">
		<span class="cta cta--pending" data-testid="support-donate-btn">
			{t('support.donate')}
			<Icon name="arrow-right" size="1rem" />
		</span>
		<small>{t('support.pending')}</small>
	</div>

	<h2 class="shop__title">{t('support.shop.title')}</h2>
	<p class="subtitle">{t('support.shop.subtitle')}</p>
	<p class="page__lead">{t('support.shop.text')}</p>

	<div class="block">
		<span class="cta cta--pending" data-testid="support-shop-btn">
			{t('support.shop.cta')}
			<Icon name="arrow-right" size="1rem" />
		</span>
		<small>{t('support.pending')}</small>
	</div>
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

	.subtitle {
		margin: 0 0 0.75rem;
		font-weight: 600;
	}

	.shop__title {
		margin: 2.5rem 0 0.5rem;
		font-size: 1.35rem;
	}

	.block {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		align-items: flex-start;
	}

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.85rem 1.5rem;
		border-radius: var(--radius-full);
		background: var(--color-secondary);
		color: var(--color-text-on-secondary);
		font-weight: 700;
	}

	/* Не посилання й не кнопка: натискати нема на що, і вигляд це визнає. */
	.cta--pending {
		opacity: 0.65;
		cursor: not-allowed;
	}

	.block small {
		color: var(--color-text-muted);
	}
</style>
