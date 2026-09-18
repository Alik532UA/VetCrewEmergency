<script lang="ts">
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/utils/withBase';
	import { LIBRARY_BY_GROUP, GROUP_EMOJI } from '$lib/data/library';
	import { settings } from '$lib/services/settings.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import PageMeta from '$lib/components/PageMeta.svelte';

	/**
	 * Бібліотека розділена на групи за ТВАРИНОЮ, зі смугою переходів угорі.
	 *
	 * Попередня редакція була одним переліком і пояснювала чому: «статей десять,
	 * пошук коштує більше, ніж дає; фільтри з'являться тоді, коли з'явиться що
	 * фільтрувати». Їх стало сімнадцять, вісім із них про одну родину, і попереду
	 * ще птахи, кажани, лисиці, рептилії — тобто той момент настав.
	 *
	 * ## Чому переходи, а не фільтр
	 *
	 * Фільтр ХОВАЄ те, що не обрано. Людина, яка помилилася групою — а помилитися
	 * легко, куницю плутають із тхором щодня, — побачить порожнечу й вирішить, що
	 * статті немає. Смуга переходів натомість лише прокручує: усе лишається на
	 * сторінці, і сусідня група за один рух ока.
	 *
	 * ## Чому за твариною, а не за ситуацією
	 *
	 * Людина бачить перед собою тварину, а не ситуацію. Вона не знає, чи це
	 * «травма», чи «пташеня випало» — вона бачить птаха. Тому перше питання
	 * переліку — «хто це».
	 */
	const lang = $derived(settings.locale);
</script>

<PageMeta title={t('library.title')} description={t('meta.library.description')} />

<section class="page">
	<h1 class="page__title">{t('library.title')}</h1>
	<p class="page__subtitle">{t('library.subtitle')}</p>

	<!--
		Звичайні посилання на якорі, не кнопки: їх можна відкрити, скопіювати,
		повернутися до них кнопкою «назад», і вони працюють до того, як виконається
		хоч один рядок скрипта.
	-->
	<nav class="jump" aria-label={t('library.groups')} data-testid="library-groups-list">
		{#each LIBRARY_BY_GROUP as g (g.group)}
			<a class="jump__chip" href="#group-{g.group}" data-testid="library-group-{g.group}-link">
				<span aria-hidden="true">{GROUP_EMOJI[g.group]}</span>
				{t(`library.group.${g.group}`)}
				<span class="jump__count">{g.items.length}</span>
			</a>
		{/each}
	</nav>

	<div data-testid="library-list">
		{#each LIBRARY_BY_GROUP as g (g.group)}
			<section class="group">
				<h2 class="group__title" id="group-{g.group}">
					<span aria-hidden="true">{GROUP_EMOJI[g.group]}</span>
					{t(`library.group.${g.group}`)}
				</h2>

				<ul class="cards" data-testid="library-list-{g.group}">
					{#each g.items as a (a.slug)}
						<li class="card">
							<div class="card__head">
								<span class="card__emoji" aria-hidden="true">{a.emoji}</span>
								<h3>{a.title[lang]}</h3>
							</div>
							<p>{a.teaser[lang]}</p>
							<a class="card__link" href={localePath(`/library/${a.slug}`, lang)}>
								{t('library.action')}
								<Icon name="arrow-right" size="1rem" />
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</section>

<style>
	/*
	 * Смуга переходів. Липка, бо з п'ятдесятьма картками головне — можливість
	 * перестрибнути, не вертаючись угору.
	 *
	 * `top` рахується від висоти шапки: під нею смуга просто зникла б.
	 */
	.jump {
		position: sticky;
		top: 72px;
		z-index: 10;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: var(--space-lg) 0 var(--space-xl);
		padding: 0.6rem 0;
		background: var(--color-bg);
	}

	.jump__chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		/* 44px — межа дотику проєкту (`tests/touch-targets.spec.ts`). */
		min-height: 44px;
		padding: 0 0.9rem;
		border: var(--border-width-soft) solid var(--color-border);
		border-radius: var(--radius-full);
		background: var(--color-bg-surface);
		color: inherit;
		text-decoration: none;
		font-weight: 600;
		transition: background-color var(--transition-fast);
	}

	.jump__chip:hover {
		background: var(--color-bg-card-hover);
	}

	/* Число статей у групі — цифрою, а не кольором: воно каже, скільки там читати. */
	.jump__count {
		opacity: 0.7;
		font-variant-numeric: tabular-nums;
	}

	.group {
		margin-bottom: var(--space-2xl);
	}

	/*
	 * `scroll-margin-top` — щоб заголовок групи не заїхав під шапку й під саму смугу
	 * переходів, коли на нього стрибнули. Без цього перехід «спрацьовує», а людина
	 * бачить середину переліку.
	 */
	.group__title {
		scroll-margin-top: calc(72px + 4rem);
		margin: 0 0 var(--space-md);
		font-size: clamp(1.2rem, 2.5vw, 1.6rem);
	}

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
		max-width: 52rem;
		color: var(--color-text-muted);
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
