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
	 * Підтримка проєкту — панель на дві колонки: пожертва ліворуч, крамниця
	 * праворуч.
	 *
	 * У референсі третьою колонкою стоять чотири значки з підписами на кшталт
	 * «обладнання та ліки». Їх тут немає, і це не забутість: підпис під значком
	 * — це твердження про те, куди підуть гроші, а таких даних у матеріалах
	 * немає. Вигадані статті витрат на сторінці збору коштів — саме той рядок,
	 * який не можна намалювати «поки що».
	 *
	 * Кнопки зелені, а не червоні (пояснення у стилях нижче). Обидві ведуть до
	 * підтримки проєкту та мають однаковий стиль.
	 */
	const lang = $derived(settings.locale);
</script>

<div class="support panel">
	<div class="support__main">
		<h2 class="support__title" {id}>{t('support.title')}</h2>
		<p class="support__subtitle">{t('support.subtitle')}</p>
		<p class="support__text">{t('support.text')}</p>
		<a class="support__cta" href={localePath('/support', lang)} data-testid="home-support-link">
			{t('support.donate')}
			<Icon name="heart" size="1.1rem" />
		</a>
		<p class="support__pending">{t('support.pending')}</p>
	</div>

	<div class="support__shop">
		<span class="support__shop-icon" aria-hidden="true"><Icon name="paw" size="1.5rem" /></span>
		<h3 class="support__shop-title">{t('support.shop.title')}</h3>
		<p class="support__shop-tagline">{t('support.shop.subtitle')}</p>
		<p class="support__text">{t('support.shop.text')}</p>
		<a
			class="support__more"
			href={localePath('/support', lang)}
			data-testid="home-support-shop-link"
		>
			{t('support.shop.cta')}
			<!-- Кошик, а не стрілка: кнопка веде в крамницю, і значок мусить казати
				 куди, а не просто «далі». -->
			<Icon name="basket" size="1.1rem" />
		</a>
	</div>
</div>

<style>
	.support {
		display: grid;
		gap: clamp(1.25rem, 3vw, 2.5rem);
		grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
	}

	.support__title {
		margin: 0;
		font-size: clamp(1.4rem, 3.5vw, 2.25rem);
		text-transform: uppercase;
	}

	.support__subtitle {
		margin: 0.35rem 0 0.75rem;
		font-weight: 600;
		color: var(--color-accent);
	}

	.support__text {
		margin: 0 0 1rem;
		color: var(--color-text-muted);
	}

	.support__cta,
	.support__more {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.85rem 1.5rem;
		border-radius: var(--radius-full);
		/*
		 * Зелена, а не червона.
		 *
		 * Червоний на цьому сайті означає «дзвони зараз»: гаряча лінія в шапці, у
		 * першому екрані й у підвалі. Пожертва — дія важлива, але не термінова, і
		 * пофарбована однаково вона з тим червоним конкурує: людина в критичну мить
		 * бачить два однакові червоні блоки й мусить читати, який із них номер.
		 *
		 * Пара кольорів без нових токенів: заливка — зелений у своїй ТЕКСТОВІЙ ролі
		 * (у темній темі світлий, у світлій темний), напис — тло теми, тобто завжди
		 * протилежне за світлістю. Заміряно: 9.18:1 у темній темі, 8.6:1 у світлій;
		 * сама кнопка проти панелі — 8.72:1 і 8.93:1.
		 *
		 * Обидві кнопки («Зробити пожертву» та «Перейти до крамниці») мають
		 * однаковий стиль, колір та відступи, оскільки ведуть до рівноцінних дій
		 * підтримки проєкту.
		 */
		background: var(--color-primary-on-surface);
		color: var(--color-bg);
		font-weight: 700;
		text-decoration: none;
		transition: background-color var(--transition-fast);
	}

	/* Наведення веде заливку до тла теми: у темній темі світло-зелений темнішає, у
	   світлій темно-зелений світлішає. Один запис, правильний напрямок в обох. */
	.support__cta:hover,
	.support__more:hover {
		background: color-mix(in srgb, var(--color-primary-on-surface) 86%, var(--color-bg));
	}

	.support__pending {
		margin: 0.6rem 0 0;
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}

	.support__shop-icon {
		display: inline-flex;
		color: var(--color-accent);
	}

	.support__shop-title {
		margin: 0.4rem 0 0.2rem;
		font-size: 1.1rem;
	}

	.support__shop-tagline {
		margin: 0 0 0.6rem;
		font-weight: 600;
	}
</style>
