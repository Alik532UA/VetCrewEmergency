<script lang="ts">
	import { t } from '$lib/i18n';
	import Icon from '$lib/components/ui/Icon.svelte';

	/**
	 * Три напрямки Vet Crew — картки зі знімком угорі.
	 *
	 * Поточний напрямок виділено золотою рамкою й підписано «ви тут», а не
	 * кнопкою «Дізнатися більше»: посилання зі сторінки на цю саму сторінку —
	 * найдешевший спосіб змусити людину клацнути й нікуди не потрапити.
	 *
	 * У двох інших кнопок теж немає: сайтів ще не існує. Замість мертвого
	 * посилання — підпис «Сайт готується», тобто те саме, що сказала б кнопка,
	 * але чесно й без кліку.
	 */
	const directions = [
		{
			icon: 'siren',
			emoji: '🚑',
			/* Власна назва цього сайту приходить зі словника — вона перекладається. */
			brand: null,
			tagline: 'app.tagline',
			text: 'directions.emergency.text',
			current: true
		},
		{
			icon: 'stethoscope',
			emoji: '🏥',
			brand: 'Vet Crew Hospital',
			tagline: 'directions.hospital.tagline',
			text: 'directions.hospital.text',
			current: false
		},
		{
			icon: 'shield',
			emoji: '🌳',
			brand: 'Vet Crew Sanctuary',
			tagline: 'directions.sanctuary.tagline',
			text: 'directions.sanctuary.text',
			current: false
		}
	] as const;
</script>

<ul class="dirs">
	{#each directions as d (d.icon)}
		<li class="dir" class:dir--current={d.current}>
			<span class="dir__shot" aria-hidden="true">{d.emoji}</span>
			<span class="dir__brand">
				<Icon name={d.icon} size="1.3rem" />
				<strong>{d.brand ?? t('app.title.full')}</strong>
			</span>
			<p class="dir__tagline">{t(d.tagline)}</p>
			<p class="dir__text">{t(d.text)}</p>
			<span class="dir__state">{d.current ? t('directions.here') : t('directions.soon')}</span>
		</li>
	{/each}
</ul>

<style>
	.dirs {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.dir {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 0.75rem 0.75rem 1.1rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-bg-card);
	}

	.dir--current {
		border-color: var(--color-accent);
	}

	.dir__shot {
		display: grid;
		place-items: center;
		margin-bottom: 0.5rem;
		aspect-ratio: 16 / 9;
		border-radius: var(--radius-md);
		background: var(--gradient-hero);
		font-size: 2.5rem;
	}

	.dir__brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0 0.5rem;
		color: var(--color-accent);
		font-family: var(--font-accent);
		font-size: 1.05rem;
		text-transform: uppercase;
	}

	.dir__tagline {
		margin: 0;
		padding: 0 0.5rem;
		font-weight: 600;
	}

	.dir__text {
		margin: 0;
		padding: 0 0.5rem;
		color: var(--color-text-muted);
	}

	.dir__state {
		margin-top: auto;
		padding: 0.6rem 0.5rem 0;
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}

	.dir--current .dir__state {
		color: var(--color-accent);
		font-weight: 600;
	}
</style>
