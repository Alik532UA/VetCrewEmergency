<script lang="ts">
	import { t } from '$lib/i18n';
	import Icon from '$lib/components/ui/Icon.svelte';

	/**
	 * Чотири випадки, з якими до служби звертаються — рядом одразу під героєм.
	 *
	 * Ключі перелічені явно, а не складені шаблоном: `t()` приймає лише наявний
	 * ключ, і саме це ловить друкарську помилку в назві. Складений рядок цю
	 * перевірку обходить — промах доїхав би до сторінки як сам ключ.
	 *
	 * ## Чотири кольори, а не один
	 *
	 * У дизайн-референсі заголовки цих карток чотирьох різних кольорів —
	 * оливкового, бурштинового, зеленого й блакитного, — і тут так само. Раніше
	 * вони були одного, золотого: міркування було, що чотири випадки рівноцінні,
	 * тож чотири кольори означали б різницю, якої немає. Автор дизайну вирішив
	 * інакше, і ряд справді читається інакше — колір тут не про важливість, а про
	 * «це інший випадок»; чотири однакові картки в один ряд око зливає в одну
	 * сіру смугу й перестає розрізняти, де закінчується перша.
	 *
	 * Ролі палітри це не ламає, бо ці кольори не входять у палітру: вони
	 * оголошені окремими токенами (`--case-*`), живуть рівно в цьому ряду й
	 * більше ніде. Золотий і далі означає «читай», червоний — «дзвони».
	 */
	const cases = [
		{
			id: 'injured',
			icon: 'paw',
			title: 'when.injured.title',
			text: 'when.injured.text',
			tint: 'var(--case-injured)'
		},
		{
			id: 'cruelty',
			icon: 'siren',
			title: 'when.cruelty.title',
			text: 'when.cruelty.text',
			tint: 'var(--case-cruelty)'
		},
		{
			id: 'front',
			icon: 'shield',
			title: 'when.front.title',
			text: 'when.front.text',
			tint: 'var(--case-front)'
		},
		{
			id: 'baby',
			icon: 'heart',
			title: 'when.baby.title',
			text: 'when.baby.text',
			tint: 'var(--case-baby)'
		}
	] as const;
</script>

<ul class="cases" data-testid="when-list">
	{#each cases as item (item.title)}
		<li class="case" style="--case-accent: {item.tint}" data-testid="when-{item.id}-card">
			<div class="case__head">
				<span class="case__icon" aria-hidden="true"><Icon name={item.icon} size="1.6rem" /></span>
				<h3 class="case__title">{t(item.title)}</h3>
			</div>
			<p class="case__text">{t(item.text)}</p>
		</li>
	{/each}
</ul>

<style>
	.cases {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr));
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/*
	 * Облямівка — той самий колір, але третиною сили.
	 *
	 * На повну силу чотири рамки перетягують на себе весь ряд і читаються як
	 * чотири різні стани, а не чотири теми; у референсі межа картки ледве
	 * вгадується й тримає колір лише натяком.
	 */
	.case {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		padding: 1.4rem;
		border: var(--border-width) solid
			color-mix(in srgb, var(--case-accent) 32%, var(--color-border));
		border-radius: var(--radius-lg);
		background: var(--color-bg-surface);
		color: var(--case-accent);
	}

	.case__head {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.case__icon {
		display: inline-flex;
		flex-shrink: 0;
	}

	.case__title {
		margin: 0;
		font-size: 1rem;
		font-weight: 800;
		line-height: 1.25;
		text-transform: uppercase;
	}

	.case__text {
		margin: 0;
		color: var(--color-text-muted);
	}
</style>
