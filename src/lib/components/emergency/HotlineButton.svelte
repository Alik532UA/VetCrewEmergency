<script lang="ts">
	import { t } from '$lib/i18n';
	import { HOTLINE } from '$lib/config';
	import Icon from '$lib/components/ui/Icon.svelte';

	/**
	 * Кнопка гарячої лінії.
	 *
	 * Окремим компонентом, бо номер стоїть щонайменше у трьох місцях — шапка,
	 * перший екран, підвал, — і три копії розійдуться на першій же зміні номера.
	 * Саме це в чеклисті й перевіряється окремим пунктом.
	 *
	 * `tel:` без пробілів і дужок: у посиланні має бути номер, який набереться,
	 * а видиме написання — окремо, для людини.
	 */
	interface Props {
		/** Власний локатор кнопки, коли пункт чеклиста вказує саме на неї. */
		testid?: string;
		compact?: boolean;
	}

	let { testid, compact = false }: Props = $props();
</script>

<a
	class="hotline"
	class:hotline--compact={compact}
	href="tel:{HOTLINE.tel}"
	data-testid={testid ?? 'hotline-btn'}
>
	<Icon name="phone" size={compact ? '1rem' : '1.4rem'} />
	<span class="hotline__text">
		{#if !compact}
			<small>{t('hotline.call')}</small>
		{/if}
		<strong>{HOTLINE.display}</strong>
		<small>{t('hotline.label')}</small>
	</span>
</a>

<style>
	.hotline {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.9rem 1.4rem;
		border-radius: var(--radius-lg);
		background: var(--color-secondary);
		color: var(--color-text-on-secondary);
		text-decoration: none;
		font-family: var(--font-accent);
	}

	.hotline--compact {
		padding: 0.5rem 0.9rem;
		gap: 0.5rem;
	}

	.hotline__text {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}

	.hotline__text strong {
		font-size: 1.15em;
		white-space: nowrap;
	}

	.hotline__text small {
		opacity: 0.85;
		font-size: 0.75em;
	}
</style>
