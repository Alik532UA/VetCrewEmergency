<script lang="ts">
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/utils/withBase';
	import { LIBRARY } from '$lib/data/library';
	import { settings } from '$lib/services/settings.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Hero from '$lib/components/emergency/Hero.svelte';
	import SectionHead from '$lib/components/emergency/SectionHead.svelte';
	import WhenToCall from '$lib/components/emergency/WhenToCall.svelte';
	import StepCircles from '$lib/components/emergency/StepCircles.svelte';
	import AboutPanel from '$lib/components/emergency/AboutPanel.svelte';
	import HelpChain from '$lib/components/emergency/HelpChain.svelte';
	import SpeciesRow from '$lib/components/emergency/SpeciesRow.svelte';
	import StoriesStrip from '$lib/components/emergency/StoriesStrip.svelte';
	import DirectionCards from '$lib/components/emergency/DirectionCards.svelte';
	import SupportPanel from '$lib/components/emergency/SupportPanel.svelte';

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
	 *
	 * Сама сторінка нічого не малює, крім бібліотеки: кожен розділ — окремий
	 * компонент. Так вимагає § 7 (стеля в 400 рядків на сторінку маршруту), але
	 * причина не лише в ній — розділи мають різну розкладку, і зібрані в одному
	 * файлі їхні стилі починають ділити класи на кшталт `.card`, після чого
	 * правка одного ряду тихо переставляє інший.
	 */
	const lang = $derived(settings.locale);
</script>

<PageMeta
	title="{t('app.title.full')} — {t('app.tagline')}"
	description={t('meta.home.description')}
/>

<!-- 1 — перший екран -->
<Hero />

<!-- 2 — коли до нас можна звертатися.
	 Без видимого заголовка, як у референсі: чотири картки стоять одразу під
	 героєм і читаються як його продовження. Ім'я розділу все одно потрібне —
	 воно приходить з `aria-label`, бо прихованого заголовка в цьому проєкті
	 нема чим зробити (утиліти `visually-hidden` не існує). -->
<section class="band band--tight" id="when" aria-label={t('when.title')} data-testid="when-section">
	<!-- Продовження кольору першого екрана, що тане в тлі сторінки. Див. `.seam` нижче. -->
	<div class="seam" aria-hidden="true"></div>
	<WhenToCall />
</section>

<!-- 3 — як відбувається порятунок -->
<section class="band" id="how" aria-labelledby="how-title">
	<div class="panel">
		<SectionHead id="how-title" title={t('how.title')} center />
		<div class="band__body"><StepCircles /></div>
	</div>
</section>

<!-- 4 — бібліотека -->
<section class="band" id="library" aria-labelledby="library-title">
	<div class="panel">
		<SectionHead id="library-title" title={t('library.title')} subtitle={t('library.subtitle')} />
		<ul class="cards" data-testid="library-featured-list">
			{#each LIBRARY as a (a.slug)}
				<li class="card">
					<div class="card__head">
						<span class="card__emoji" aria-hidden="true">{a.emoji}</span>
						<h3>{a.title[lang]}</h3>
					</div>
					<p class="card__teaser">{a.teaser[lang]}</p>
					<a
						class="card__link"
						href={localePath(`/library/${a.slug}`, lang)}
						data-testid="library-{a.slug}-link"
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
	</div>
</section>

<!-- 5 — про нас -->
<section class="band" id="about" aria-labelledby="about-title">
	<AboutPanel id="about-title" />
</section>

<!-- 6 — шлях тварини -->
<section class="band" id="journey" aria-labelledby="journey-title">
	<div class="panel">
		<SectionHead id="journey-title" title={t('journey.title')} center />
		<div class="band__body"><HelpChain /></div>
	</div>
</section>

<!-- 7 — кому допомагаємо -->
<section class="band" id="species" aria-labelledby="species-title">
	<div class="panel">
		<SectionHead id="species-title" title={t('hero.species')} />
		<div class="band__body"><SpeciesRow /></div>
	</div>
</section>

<!-- 8 — історії порятунку -->
<section class="band" id="stories" aria-labelledby="stories-title">
	<div class="panel">
		<SectionHead id="stories-title" title={t('stories.title')} subtitle={t('stories.counter')} />
		<p class="band__lead">{t('stories.lead')}</p>
		<div class="bleed"><StoriesStrip /></div>
		<a class="band__all" href={localePath('/stories', lang)}>
			{t('stories.all')}
			<Icon name="arrow-right" size="1rem" />
		</a>
	</div>
</section>

<!-- 9 — наші напрямки -->
<section class="band" id="directions" aria-labelledby="directions-title">
	<div class="panel">
		<SectionHead
			id="directions-title"
			title={t('directions.title')}
			subtitle={t('directions.subtitle')}
		/>
		<p class="band__lead">{t('directions.lead')}</p>
		<div class="band__body"><DirectionCards /></div>
	</div>
</section>

<!-- 10 — підтримка проєкту -->
<section class="band" id="support" aria-labelledby="support-title">
	<SupportPanel id="support-title" />
</section>

<style>
	/*
	 * Смуга розділу: майже на всю ширину вікна й із вузькою щілиною між сусідами.
	 *
	 * Обидва числа — з дизайн-референсу, заміряні на самому макеті: панелі там
	 * відступають від краю приблизно на два відсотки ширини, а вертикальна щілина
	 * між ними вдвічі менша за товщину рядка. До 2026-09-13 тут стояло
	 * `max-width: 76rem` із відступом до трьох ремів — сторінка виходила вдвічі
	 * вища за макет при тому самому вмісті, а на широкому екрані читалася як
	 * вузька колонка посередині порожнього поля.
	 *
	 * `110rem`, а не `none`: обмеження все ще потрібне, просто воно має спрацьовувати
	 * на справді широкому моніторі, а не на звичайному ноутбуці.
	 */
	.band {
		max-width: 110rem;
		margin: 0 auto;
		padding: clamp(0.5rem, 1.2vw, 1rem) clamp(1rem, 2.5vw, 3rem);
	}

	/* Одразу під героєм, без звичного відступу зверху: у референсі картки
	   притулені до першого екрана й дочитують його думку. */
	.band--tight {
		position: relative;
		padding-top: 0;
	}

	/*
	 * Шов між першим екраном і рештою сторінки.
	 *
	 * Перший екран закінчується суцільним кольором, а нижче вже тло сторінки:
	 * фотографія під напівпрозорою заливкою теми. Два різні покриття стикалися
	 * рівною лінією через усе вікно.
	 *
	 * Розчин лежить НИЖЧЕ стику, бо розчиняється він у тлі сторінки: угорі
	 * непрозорий, унизу прозорий. `z-index: -1` кладе його під картки (вони
	 * непрозорі й просто закривають його собою) і над фоновим шаром сторінки —
	 * той теж на `-1`, але стоїть раніше в розмітці.
	 *
	 * Починається з `--color-bg`, а НЕ з `--color-band`, і це не дрібниця: низ
	 * першого екрана домальовує `.hero__scrim`, який доводить смугу саме до
	 * `--color-bg`. Перша редакція взяла тут колір смуги — світліший на два кроки
	 * від того, чим екран насправді закінчується, — і замість шва вийшла та сама
	 * лінія, тільки на пару пікселів нижче.
	 */
	.seam {
		position: absolute;
		z-index: -1;
		top: 0;
		/* На всю ширину вікна, а не смуги: сама лінія стику йде через усе вікно, і
		   розчин, обмежений контейнером, лишив би її видимою на полях обабіч.
		   `overflow-x: hidden` на body (base.css) не дає цьому дати смугу
		   прокручування. */
		right: calc(50% - 50vw);
		left: calc(50% - 50vw);
		height: 10rem;
		pointer-events: none;
		background: linear-gradient(to bottom, var(--color-bg), transparent);
	}

	/*
	 * Стрічка історій виходить із панелі до країв вікна.
	 *
	 * Прохання автора: обрізатися має сторінка, а не контейнер. Тут вона
	 * лишається в панелі разом із заголовком і посиланням, тож ширину повертає
	 * від'ємний відступ: половина ширини панелі мінус половина ширини вікна з
	 * кожного боку якраз дає 100vw.
	 *
	 * Ширину не оголошено: блок і так займає все, що дають йому поля. `100vw`
	 * тут був би гіршим — при зарезервованій смузі прокрутки (scrollbar-gutter у
	 * base.css) це на кілька пікселів більше за видиму ширину, і стрічка поїхала б
	 * праворуч.
	 */
	.bleed {
		margin-inline: calc(50% - 50vw);
	}

	.band__body {
		margin-top: 1.5rem;
	}

	.band__lead {
		max-width: 52rem;
		color: var(--color-text-muted);
	}

	/*
	 * `position: relative` тут не про координати, а про те, хто отримує курсор.
	 *
	 * Під стрічкою історій це посилання лежало ПІД каруселлю. Стрічка резервує
	 * усередині себе 96 пікселів під тіні карток і половину з них забирає назад
	 * від'ємним відступом — тобто наступний елемент піднімається у цю смугу, а
	 * `.carousel-root` позиційований і малюється поверх нього. Заміряно
	 * `elementFromPoint` просто на написі: під курсором опинявся
	 * `.carousel-content`, а не посилання. Через це «Дивитися всі історії» не
	 * реагувало на наведення й не клікалося б у верхній частині рядка.
	 *
	 * Друге посилання з тим самим класом («Вся бібліотека») працювало — під ним
	 * каруселі немає. Саме тому дефект і виглядав як «те саме правило то діє, то
	 * ні».
	 */
	.band__all {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 1rem;
		font-weight: 600;
		color: var(--color-accent);
		text-decoration: none;
	}
	/* Наведення мусить бути видно. Підкреслення, а не зміна кольору: ці посилання вже набрані акцентом, і «золоте на трохи іншому золотому» читається як нічого. */
	.band__all:hover {
		text-decoration: underline;
		text-underline-offset: 0.25em;
	}

	/* `auto-fit` замість фіксованої кількості колонок: карток у розділах різна
	   кількість, і окреме правило для кожного розійшлося б із даними на першій
	   же доданій картці. */
	.cards {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr));
		margin: 1.5rem 0 0;
		padding: 0;
		list-style: none;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1.25rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-bg-surface);
	}

	.card__head {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.card h3 {
		margin: 0;
		font-size: 1.05rem;
	}

	.card p {
		margin: 0;
		color: var(--color-text-muted);
	}

	.card__teaser {
		display: none;
	}

	.card__emoji {
		font-size: 1.75rem;
		line-height: 1;
		flex-shrink: 0;
	}

	.card__link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-top: auto;
		font-weight: 600;
		color: var(--color-accent);
		text-decoration: none;
	}
	/* Наведення мусить бути видно. Підкреслення, а не зміна кольору: ці посилання вже набрані акцентом, і «золоте на трохи іншому золотому» читається як нічого. */
	.card__link:hover {
		text-decoration: underline;
		text-underline-offset: 0.25em;
	}
</style>
