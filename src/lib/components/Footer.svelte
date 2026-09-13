<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { t } from '$lib/i18n';
	import { localePath, withBase } from '$lib/utils/withBase';
	import { SIDE_PROJECTS, CONTACT_EMAIL, ADDRESS, SOCIALS } from '$lib/config';
	import { siblingUrl } from '$lib/siblings';
	import { settings } from '$lib/services/settings.svelte';
	import HotlineButton from '$lib/components/emergency/HotlineButton.svelte';

	/**
	 * Підвал.
	 *
	 * Гаряча лінія стоїть тут другий раз за сторінку, і це не недогляд: людина,
	 * яка дочитала до низу, не мусить вертатися нагору по номер. Обидві кнопки
	 * малює один компонент — тож номер у них не може розійтися.
	 */
	const lang = $derived(settings.locale);

	const links = [
		{ href: '/', key: 'nav.home' },
		{ href: '/library', key: 'nav.library' },
		{ href: '/stories', key: 'nav.stories' },
		{ href: '/about', key: 'nav.about' },
		{ href: '/report', key: 'nav.report' },
		{ href: '/support', key: 'nav.support' }
	] as const;
</script>

<footer class="footer">
	<div class="footer__content">
		<div class="footer__brand">
			<img src={withBase('/images/logo/vetcrew.webp')} alt="" width="56" height="56" />
			<p class="footer__name">{t('app.title.full')}</p>
			<p class="footer__tagline">{t('app.tagline')}</p>
		</div>

		<div class="footer__col">
			<h2>{t('footer.contacts')}</h2>
			<ul class="footer__list">
				<li>
					<Icon name="email" size="1rem" />
					<a href="mailto:{CONTACT_EMAIL.rescue}">{CONTACT_EMAIL.rescue}</a>
				</li>
				<li><Icon name="map-pin" size="1rem" /> {ADDRESS[lang]}</li>
			</ul>

			<ul class="footer__socials">
				{#each SOCIALS as social (social.id)}
					<li>
						<a href={social.url} rel="noopener noreferrer" target="_blank" aria-label={social.id}>
							<img src={withBase(social.icon)} alt="" width="28" height="28" />
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="footer__col">
			<h2>{t('footer.howToSupport')}</h2>
			<ul class="footer__list footer__list--plain">
				{#each links as link (link.href)}
					<li><a href={localePath(link.href, lang)}>{t(link.key)}</a></li>
				{/each}
			</ul>
		</div>

		<div class="footer__col footer__col--hotline">
			<HotlineButton />
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
	.footer {
		margin-top: 3rem;
		padding: 2.5rem 1rem 1.5rem;
		background: var(--color-bg-surface);
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

	.footer__socials {
		display: flex;
		gap: 0.6rem;
		margin: 1rem 0 0;
		padding: 0;
		list-style: none;
	}

	.footer__socials img {
		display: block;
		border-radius: var(--radius-sm);
	}

	.footer__col--hotline {
		display: flex;
		align-items: flex-start;
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
		border-top: 1px solid var(--color-border);
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
