<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { t } from '$lib/i18n';
	import { withBase } from '$lib/utils/withBase';
	import { SIDE_PROJECTS, CONTACT_EMAIL, ADDRESS, SOCIALS, REPORT_URL } from '$lib/config';
	import { siblingUrl } from '$lib/siblings';
	import { settings } from '$lib/services/settings.svelte';
	import HotlineButton from '$lib/components/emergency/HotlineButton.svelte';
	import { handleEmailClick } from '$lib/utils/emailAction';

	/**
	 * Підвал.
	 *
	 * Гаряча лінія та кнопка «Повідомити про знахідку» стоять тут другий раз за сторінку,
	 * і це не недогляд: людина, яка дочитала до низу, не мусить вертатися нагору по номер
	 * або щоб надіслати фото й координати.
	 */
	const lang = $derived(settings.locale);
</script>

<footer class="footer">
	<div class="footer__content">
		<div class="footer__brand">
			<div class="footer__brand-head">
				<img src={withBase('/images/logo/vetcrew.webp')} alt="" width="56" height="56" />
				<ul class="footer__socials">
					{#each SOCIALS as social (social.id)}
						<li>
							<a
								href={social.url}
								rel="noopener noreferrer"
								target="_blank"
								aria-label={social.id}
								data-testid="footer-social-{social.id}-link"
							>
								<img src={withBase(social.icon)} alt="" width="28" height="28" />
							</a>
						</li>
					{/each}
				</ul>
			</div>
			<p class="footer__name">{t('footer.title')}</p>
			<p class="footer__tagline">{t('app.tagline')}</p>
		</div>

		<div class="footer__col">
			<h2>{t('footer.contacts')}</h2>
			<ul class="footer__list">
				<li>
					<Icon name="email" size="1rem" />
					<a
						href="mailto:{CONTACT_EMAIL.rescue}"
						onclick={(event) => handleEmailClick(event, CONTACT_EMAIL.rescue)}
						data-testid="footer-email-link"
					>
						{CONTACT_EMAIL.rescue}
					</a>
				</li>
				<li><Icon name="map-pin" size="1rem" /> {ADDRESS[lang]}</li>
			</ul>
		</div>

		<div class="footer__col footer__col--actions">
			<HotlineButton testid="footer-hotline-btn" />
			<a
				class="footer__report"
				href={REPORT_URL}
				target="_blank"
				rel="noopener noreferrer"
				data-testid="footer-report-link"
			>
				<Icon name="telegram" size="1.25rem" />
				<span>
					<strong>{t('hero.report')}</strong>
					<small>{t('hero.reportHint')}</small>
				</span>
			</a>
		</div>
	</div>

	<div class="footer__bottom">
		<small>© {t('footer.rights')}</small>

		<!-- Сусідні сайти — тихо: по них сюди не приходять. -->
		<ul class="footer__aside">
			{#each SIDE_PROJECTS as project (project.id)}
				<li>
					<a
						href={siblingUrl(project.site, settings.locale)}
						rel="noopener noreferrer"
						aria-label={t(project.key)}
						data-testid="footer-side-{project.id}-link"
					>
						<Icon name={project.icon} size="1.4rem" />
					</a>
				</li>
			{/each}
		</ul>
	</div>
</footer>

<style>
	/*
	 * Підвал в'їжджає градієнтом, а не рівною лінією.
	 *
	 * Тло сторінки — фотографія під напівпрозорою заливкою теми, а підвал —
	 * суцільний колір поверхні. Де вони зустрічалися, через усю ширину вікна йшла
	 * різка горизонтальна межа: у світлій темі вона особливо помітна, бо там
	 * фотографія світла й строката, а підвал білий.
	 *
	 * Смуга розчину висить НАД підвалом (`bottom: 100%`), тобто лежить на тлі
	 * сторінки й розчиняється в ньому знизу вгору. Через `margin-top` вона не
	 * додає висоти — верхній відступ підвала й так тримає це місце порожнім.
	 */
	.footer {
		position: relative;
		margin-top: 3rem;
		padding: 2.5rem 1rem 1.5rem;
		background: var(--color-bg-surface);
	}

	.footer::before {
		content: '';
		position: absolute;
		right: 0;
		bottom: 100%;
		left: 0;
		height: 3rem;
		pointer-events: none;
		background: linear-gradient(to bottom, transparent, var(--color-bg-surface));
	}

	.footer__content {
		display: grid;
		gap: 2rem;
		grid-template-columns: repeat(auto-fit, minmax(min(14rem, 100%), 1fr));
		max-width: 68rem;
		margin: 0 auto;
	}

	.footer__name {
		margin: 0.5rem 0 0;
		font-weight: 700;
	}

	.footer__tagline {
		margin: 0.2rem 0 0;
		color: var(--color-text-muted);
	}

	.footer__col h2 {
		margin: 0 0 0.6rem;
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
	}

	/*
	 * Кожне посилання підвалу відповідає на курсор.
	 *
	 * Їх тут найбільше на сайті — контакти, розділи, способи підтримки — і жодне
	 * не реагувало: глобальне `a:hover` з base.css програє за вагою скоупнутим
	 * правилам цього файлу, тож правило мусить жити тут.
	 */
	.footer__list a:hover {
		text-decoration: underline;
		text-underline-offset: 0.25em;
	}

	.footer__list {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.footer__list li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.footer__list a {
		color: inherit;
	}

	.footer__brand-head {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.footer__socials {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.footer__socials img {
		display: block;
		border-radius: var(--radius-sm);
	}

	.footer__col--actions {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.75rem;
	}

	.footer__col--actions :global(.hotline),
	.footer__report {
		width: 100%;
	}

	.footer__report {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.9rem 1.4rem;
		border-radius: var(--radius-lg);
		/*
		 * Суцільний синій без рамки.
		 *
		 * Обведена кнопка поруч із суцільною читалася другорядною при будь-якій
		 * товщині рамки — пробували 1, 3, 5 і 10 пікселів. Вага приходить від
		 * заливки, не від лінії: дві суцільні кнопки різного кольору нарешті
		 * кажуть «подзвонити АБО написати», а не «головне і додаткове».
		 */
		background: var(--color-tertiary);
		color: var(--color-text-on-tertiary);
		text-decoration: none;
		font-family: var(--font-accent);
		transition: background-color var(--transition-fast);
	}

	.footer__report:hover {
		background: var(--color-tertiary-light);
	}

	.footer__report span {
		display: flex;
		flex-direction: column;
		line-height: 1.25;
	}

	/* Приглушено прозорістю, а не `--color-text-muted`: той токен розрахований на
	   тло сторінки, і на суцільному синьому давав 2.4:1. */
	.footer__report small {
		opacity: 0.85;
	}

	.footer__bottom {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		max-width: 68rem;
		margin: 2rem auto 0;
		padding-top: 1rem;
		border-top: var(--border-width) solid var(--color-border);
		color: var(--color-text-muted);
	}

	.footer__aside {
		display: flex;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* Тихо — але не невидимо: непомітне посилання все одно їде в розмітці, а
	   людина, яка на нього натиснула, мусить бачити, що воно натискається. */
	.footer__aside a {
		display: inline-flex;
		opacity: 0.55;
		color: inherit;
		transition: opacity var(--transition-fast);
	}

	.footer__aside a:hover,
	.footer__aside a:focus-visible {
		opacity: 1;
	}
</style>
