<script lang="ts">
	import { t } from '$lib/i18n';
	import { REPORT_URL } from '$lib/config';
	import Icon from '$lib/components/ui/Icon.svelte';
	import HotlineButton from '$lib/components/emergency/HotlineButton.svelte';
	import heroPhoto from '$lib/assets/hero/hero-fawn-v02.webp';

	/**
	 * Перший екран: текст ліворуч, знімок праворуч до самого краю.
	 *
	 * Дві колонки, а не одна — так у дизайн-референсі, і причина в довжині
	 * рядка: на широкому екрані текст в одну колонку розтягується на півтора
	 * метра й читається гірше, ніж у вужчій.
	 *
	 * ## Знімок виходить у край, а не стоїть у рамці
	 *
	 * У референсі фотографія займає праву половину екрана цілком — від верхньої
	 * межі до нижньої й до правого краю вікна, без полів і без заокруглення. Це
	 * не оформлення: рамка навколо знімка робить його ілюстрацією ДО тексту, а
	 * вихід у край робить його самим екраном, на якому текст лежить. Саме тому
	 * розділ тут на всю ширину, а поля тримає внутрішній `.hero__inner`, — до
	 * 2026-09-13 ширину обмежував сам розділ, і кольорова смуга першого екрана
	 * обривалася за два пальці від краю вікна.
	 *
	 * Ліва межа знімка не пряма, а розчинена маскою: у референсі ліс на фото
	 * темніє й переходить у тло сторінки без жодної лінії. Пряма межа на цьому
	 * місці читається як два склеєні макети.
	 *
	 * ## Чому `fetchpriority`
	 *
	 * Це найбільший елемент першого екрана, тобто LCP сторінки. Підказка на
	 * сторінці одна — `check-build.js` § 4D не дає з'явитися другій, і це
	 * навмисно: два «найголовніші» зображення означають жодного.
	 *
	 * Розміри файлу оголошені атрибутами (§ 10.2): доки знімок їде, браузер має
	 * знати, скільки місця під нього лишити, інакше все нижче від'їде тієї миті,
	 * коли він приїде.
	 */
	/** Власні розміри `hero-fawn-v02.webp`. */
	const PHOTO_WIDTH = 2752;
	const PHOTO_HEIGHT = 1536;
</script>

<section class="hero" aria-labelledby="hero-title">
	<div class="hero__scrim" aria-hidden="true"></div>

	<div class="hero__inner">
		<div class="hero__text">
			<h1 class="hero__title" id="hero-title">
				<span>{t('hero.title.1')}</span>
				<span class="hero__accent">{t('hero.title.2')}</span>
				<span>{t('hero.title.3')}</span>
			</h1>
			<p class="hero__tagline">{t('app.tagline')}</p>
			<p class="hero__lead">{t('hero.text')}</p>

			<div class="hero__actions">
				<HotlineButton testid="hero-hotline-btn" />
				<!-- Веде в Telegram, а не на сторінку сайту: форми поки не буде (див.
				 REPORT_URL у config.ts). -->
				<a
					class="hero__report"
					href={REPORT_URL}
					target="_blank"
					rel="noopener noreferrer"
					data-testid="hero-report-link"
				>
					<Icon name="telegram" size="1.25rem" />
					<span>
						<strong>{t('hero.report')}</strong>
						<small>{t('hero.reportHint')}</small>
					</span>
				</a>
			</div>

			<p class="hero__pending">{t('hotline.placeholder')}</p>
			<p class="hero__area"><Icon name="map-pin" size="1rem" /> {t('hero.area')}</p>
		</div>
	</div>

	<div class="hero__media">
		<img
			class="hero__photo"
			src={heroPhoto}
			alt={t('hero.photoAlt')}
			width={PHOTO_WIDTH}
			height={PHOTO_HEIGHT}
			fetchpriority="high"
			decoding="async"
		/>
	</div>
</section>

<style>
	/*
	 * Розділ підтягнуто під шапку, щоб знімок ішов під самий верх вікна.
	 *
	 * `.main` тримає 72 пікселі відступу під фіксовану смугу; від'ємний відступ
	 * забирає їх назад, а власний `padding-top` тієї ж висоти повертає текст на
	 * місце. Виграє знімок: він лежить у `inset: 0` і тепер накриває й ту смугу —
	 * саме так, як у референсі, де шапка стоїть просто на фотографії.
	 *
	 * Перші 5 рем `.hero__scrim` прозорі, тож під самою шапкою лишається чистий
	 * колір смуги розділу, і активній вкладці є куди сісти.
	 */
	.hero {
		position: relative;
		overflow: hidden;
		margin-top: -72px;
		padding-top: 72px;
	}

	/*
	 * Смуга першого екрана темнішає донизу — окремим шаром, а не власним тлом.
	 *
	 * Тло тут малює не цей файл, а `+layout.svelte`: `.main > :first-child` фарбує
	 * перший розділ кожної сторінки в --color-band, щоб активна вкладка шапки
	 * мала куди перетекти. Колір потрібен рівно вгорі, під самою вкладкою, — нижче
	 * він робить із першого екрана світлий прямокутник, на якому темний ліс знімка
	 * обривається видимою межею. У референсі там суцільна темрява.
	 *
	 * Затемнення живе на власному елементі, і це не оформлення коду. Розділ мусить
	 * лишитися з ОДНИМ рівним кольором тла: `tests/ui.spec.ts` читає в нього
	 * `background-image` і падає на будь-якому непорожньому значенні — бо колір
	 * вкладки шапки береться звідти ж, і градієнт на самому розділі означав би
	 * вкладку одного відтінку над смугою іншого. Перша редакція цієї правки
	 * поставила градієнт саме на `.hero` й зламала цей інваріант.
	 *
	 * Перші 5 рем прозорі — це висота шапки: рівно там вкладка й сідає на смугу.
	 */
	.hero__scrim {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background-image: linear-gradient(
			to bottom,
			transparent 0,
			transparent 5rem,
			color-mix(in srgb, var(--color-bg) 76%, transparent) 45%,
			var(--color-bg) 100%
		);
	}

	.hero__inner {
		position: relative;
		z-index: 1;
		max-width: 110rem;
		margin: 0 auto;
		padding: clamp(1.75rem, 4vw, 3.5rem) clamp(1rem, 2.5vw, 3rem);
	}

	.hero__title {
		display: flex;
		flex-direction: column;
		margin: 0 0 0.35rem;
		/* Дрібніше, ніж було: у референсі заголовок займає третину колонки, а не
		   весь екран — під ним мусять поміститися дві кнопки й рядок про зону. */
		font-size: clamp(2rem, 4.2vw, 3.4rem);
		line-height: 1.04;
		text-transform: uppercase;
	}

	.hero__accent {
		color: var(--color-accent);
	}

	.hero__tagline {
		margin: 0 0 1rem;
		font-size: 0.9rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-text-muted);
	}

	.hero__lead {
		margin: 0 0 1.5rem;
		max-width: 34rem;
	}

	.hero__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	/*
	 * Червона обводка, а не золота.
	 *
	 * Обидві кнопки першого екрана — це ДІЯ, і то термінова: подзвонити або написати.
	 * Золотий у цій палітрі означає «читай» (заголовки, посилання «детальніше»), і
	 * обведена ним кнопка ставала в один ряд із текстом, а не з червоним блоком
	 * поруч. Тепер пара читається як одна: суцільний червоний — подзвонити,
	 * обведений — написати.
	 */
	.hero__report {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.9rem 1.4rem;
		border: 1px solid var(--color-secondary);
		border-radius: var(--radius-lg);
		background: transparent;
		color: inherit;
		text-decoration: none;
		transition:
			background-color var(--transition-fast),
			border-color var(--transition-fast);
	}

	/* Наведення видно: обводка світлішає, усередину лягає тонка червона заливка.
	   Не суцільний червоний — тоді обведена кнопка стала б другою суцільною, і пара
	   втратила б різницю між «подзвонити» і «написати». */
	.hero__report:hover {
		border-color: var(--color-secondary-light);
		background: color-mix(in srgb, var(--color-secondary) 16%, transparent);
	}

	.hero__report span {
		display: flex;
		flex-direction: column;
		line-height: 1.25;
	}

	.hero__report small {
		color: var(--color-text-muted);
	}

	.hero__pending,
	.hero__area {
		margin: 0 0 0.5rem;
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}

	/*
	 * Вузький екран: знімок — звичайний блок під текстом.
	 *
	 * Не тло під написом, і це не смак. Білий текст поверх фотографії має
	 * контраст, який залежить від того, яка саме ділянка кадру опинилася під
	 * рядком; на широкому екрані текст лежить на тлі сторінки, а фото починається
	 * там, де текст закінчився. Повторити це на вузькому нема як — колонка одна.
	 */
	.hero__media {
		/*
		 * `position` тут не заради координат, а заради порядку малювання.
		 *
		 * `.hero__scrim` — позиційований елемент із `z-index: 0`, тобто малюється
		 * ПОВЕРХ звичайних блоків у потоці, хай навіть ті стоять нижче в розмітці.
		 * На вузькому екрані знімок саме такий блок, і затемнення накривало його
		 * цілком: унизу смуги воно вже суцільного кольору тла. Власний шар ставить
		 * знімок у той самий ряд, а далі вирішує порядок у розмітці.
		 */
		position: relative;
		z-index: 1;
		padding: 0 clamp(1rem, 2.5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem);
	}

	.hero__photo {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 5 / 4;
		border-radius: var(--radius-lg);
		object-fit: cover;
		object-position: 62% 45%;
	}

	@media (min-width: 60rem) {
		.hero {
			display: grid;
			align-items: center;
			min-height: min(44rem, 82vh);
		}

		.hero__inner {
			grid-area: 1 / 1;
			width: 100%;
		}

		/*
		 * Знімок починається з 24% ширини вікна, а не з 42%.
		 *
		 * Два наслідки, і обидва потрібні. Оленя їде ліворуч — у попередній
		 * розкладці воно стояло майже в правому краю й підрізалося. І з'являється
		 * місце під довгий розчин: розтягнути його в старій рамці було нікуди,
		 * 34% від 1080 пікселів — це 367, а треба втричі більше.
		 *
		 * Розчин тепер до 78% ширини рамки: при вікні 1863 це 1104 пікселі проти
		 * колишніх 367. Кінець розчину стоїть перед оленям навмисно — саме воно й
		 * має бути єдиним місцем кадру на повну силу, решта тане в тло.
		 */
		.hero__media {
			position: absolute;
			inset: 0 0 0 24%;
			/* Назад під текст: на широкому екрані вони таки накладаються. */
			z-index: 0;
			padding: 0;
			/* Ліва межа розчиняється в тлі — див. докблок угорі. Префікс потрібен
			   досі: Safari без нього малює знімок прямокутником. */
			-webkit-mask-image: linear-gradient(to right, transparent 0%, #000 78%);
			mask-image: linear-gradient(to right, transparent 0%, #000 78%);
		}

		/*
		 * Верхній і нижній краї знімка розчиняються так само, як лівий.
		 *
		 * Не другою маскою, хоч напрошується саме вона: дві маски складаються лише
		 * через `mask-composite: intersect`, і там, де його не підтримали, знімок
		 * лишається з рівним обрізом — тобто рівно з тим дефектом, який маска й мала
		 * прибрати. Градієнт у кольорі тла малює те саме й нічого не вимагає.
		 *
		 * Кольори різні зверху й знизу, бо різне те, у що знімок перетікає: угорі
		 * смуга першого екрана (--color-band, туди ж сідає вкладка шапки), унизу
		 * вже тло сторінки, до якого затемнення `.hero__scrim` довело смугу.
		 */
		.hero__media::after {
			content: '';
			position: absolute;
			inset: 0;
			pointer-events: none;
			background-image: linear-gradient(
				to bottom,
				var(--color-band) 0%,
				transparent 22%,
				transparent 72%,
				var(--color-bg) 100%
			);
		}

		.hero__photo {
			height: 100%;
			aspect-ratio: auto;
			border-radius: 0;
		}

		.hero__text {
			/* Ширше за абзац: у референсі дві кнопки першого екрана стоять поруч, а
			   не стовпчиком, і саме тому колонка мусить бути ширшою за рядок тексту.
			   Довжину рядка тримає окремий max-width на самому абзаці. */
			max-width: 44rem;
		}
	}
</style>
