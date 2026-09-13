<script lang="ts">
	import { t } from '$lib/i18n';
	import { REPORT_EMAIL } from '$lib/config';
	import PageMeta from '$lib/components/PageMeta.svelte';
	import HotlineButton from '$lib/components/emergency/HotlineButton.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	/**
	 * Форма повідомлення про тварину.
	 *
	 * Поки що вона складає ЛИСТ, а не надсилає запит: серверної частини в цього
	 * сайту немає — він статичний. `mailto:` з підставленою темою й тілом — не
	 * заглушка, а робочий шлях: людина бачить готовий лист і надсилає його своєю
	 * поштою, а адреса лишається однією й тією ж у `config`.
	 *
	 * Найважливіше на цій сторінці — не форма, а рядок над нею: якщо тварина в
	 * небезпеці ПРОСТО ЗАРАЗ, треба телефонувати, а не писати. Тому кнопка
	 * гарячої лінії стоїть ПЕРЕД полями, а не під ними.
	 */
	let name = $state('');
	let contact = $state('');
	let place = $state('');
	let message = $state('');
	let tried = $state(false);
	let sent = $state(false);

	const missing = $derived({
		name: name.trim() === '',
		contact: contact.trim() === '',
		place: place.trim() === '',
		message: message.trim() === ''
	});
	const invalid = $derived(Object.values(missing).some(Boolean));

	const mailto = $derived(
		`mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(
			`${t('report.title')}: ${place || '—'}`
		)}&body=${encodeURIComponent(
			[
				`${t('report.name')}: ${name}`,
				`${t('report.contact')}: ${contact}`,
				`${t('report.place')}: ${place}`,
				'',
				message
			].join('\n')
		)}`
	);

	function submit(event: SubmitEvent) {
		tried = true;
		if (invalid) {
			event.preventDefault();
			return;
		}
		window.location.href = mailto;
		sent = true;
		event.preventDefault();
	}
</script>

<PageMeta title={t('report.title')} description={t('meta.report.description')} />

<section class="page">
	<h1 class="page__title">{t('report.title')}</h1>
	<p class="urgent">{t('report.urgent')}</p>
	<HotlineButton />
	<p class="page__lead">{t('report.lead')}</p>

	<form class="form" onsubmit={submit} novalidate>
		<label>
			<span>{t('report.name')}</span>
			<input bind:value={name} data-testid="report-name-input" />
			{#if tried && missing.name}<em>{t('report.required')}</em>{/if}
		</label>
		<label>
			<span>{t('report.contact')}</span>
			<input bind:value={contact} data-testid="report-contact-input" />
			{#if tried && missing.contact}<em>{t('report.required')}</em>{/if}
		</label>
		<label>
			<span>{t('report.place')}</span>
			<input bind:value={place} data-testid="report-place-input" />
			{#if tried && missing.place}<em>{t('report.required')}</em>{/if}
		</label>
		<label>
			<span>{t('report.message')}</span>
			<textarea rows="5" bind:value={message} data-testid="report-message-input"></textarea>
			{#if tried && missing.message}<em>{t('report.required')}</em>{/if}
		</label>

		<Button type="submit" data-testid="report-submit-btn">{t('report.submit')}</Button>

		{#if sent}
			<p class="sent" data-testid="report-sent-message">{t('report.sent')}</p>
		{/if}
	</form>
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

	.urgent {
		margin: 0 0 1rem;
		font-weight: 700;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.form label {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.form input,
	.form textarea {
		padding: 0.7rem 0.9rem;
		border: var(--border-width) solid var(--color-field-border);
		border-radius: var(--radius-md);
		background: var(--color-bg-surface);
		color: inherit;
		font: inherit;
	}

	.sent {
		margin: 0;
		font-weight: 600;
		color: var(--color-success);
	}

	.form em {
		color: var(--color-error);
		font-style: normal;
		font-size: 0.85rem;
	}
</style>
