<script lang="ts">
	import { t } from '$lib/i18n';
	import Icon from '$lib/components/ui/Icon.svelte';

	/**
	 * Шлях тварини — ланцюжком зі стрілками між ланками.
	 *
	 * Стрілка тут несе сенс, якого немає в сітці карток: етапи йдуть строго один
	 * за одним, і «Випуск» не буває раніше за «Реабілітацію». Тому це `<ol>`, а
	 * стрілка — декорація поверх порядку, а не сам порядок.
	 *
	 * Остання ланка стрілки не має. Дрібниця, але саме вона відрізняє ланцюжок
	 * від переліку: стрілка після «Довічного прихистку» вказувала б у порожнечу,
	 * тобто обіцяла б крок, якого немає.
	 */
	const stages = [
		{ icon: 'ambulance', title: 'journey.s1.title', text: 'journey.s1.text' },
		{ icon: 'stethoscope', title: 'journey.s2.title', text: 'journey.s2.text' },
		{ icon: 'pulse', title: 'journey.s3.title', text: 'journey.s3.text' },
		{ icon: 'tree', title: 'journey.s4.title', text: 'journey.s4.text' },
		{ icon: 'home', title: 'journey.s5.title', text: 'journey.s5.text' }
	] as const;
</script>

<ol class="chain">
	{#each stages as stage, i (stage.title)}
		<li class="chain__item">
			<span class="chain__badge" aria-hidden="true">
				<Icon name={stage.icon} size="1.5rem" />
			</span>
			<h3 class="chain__title">{t(stage.title)}</h3>
			<p class="chain__text">{t(stage.text)}</p>
			{#if i < stages.length - 1}
				<span class="chain__sep" aria-hidden="true">
					<Icon name="chevron-right" size="1.25rem" />
				</span>
			{/if}
		</li>
	{/each}
</ol>

<style>
	.chain {
		display: grid;
		gap: 1.5rem 0;
		grid-template-columns: repeat(auto-fit, minmax(min(11rem, 100%), 1fr));
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.chain__item {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
		/* Місце під стрілку праворуч: без нього вона лягає на текст сусіда. */
		padding: 0 1.5rem;
		text-align: center;
	}

	.chain__badge {
		display: grid;
		place-items: center;
		width: 3.75rem;
		height: 3.75rem;
		margin-bottom: 0.35rem;
		border: 1px solid var(--color-accent);
		border-radius: 50%;
		color: var(--color-accent);
	}

	.chain__title {
		margin: 0;
		font-size: 0.95rem;
	}

	.chain__text {
		margin: 0;
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}

	/*
	 * Стрілка стоїть на висоті кружка, а не посередині ланки: підписи різної
	 * довжини, тож центр ланки гуляє, а центр кружка — ні.
	 *
	 * `translateY(-50%)` від верху плюс половина кружка. Коли сітка згортається
	 * в один стовпець, стрілка лишається праворуч від кружка й читається як
	 * «далі вниз» — гірше, ніж хотілося б, але помітно краще за поворот на 90°,
	 * який довелося б вішати на media-query з тим самим порогом, що й у
	 * `auto-fit`. Такий поріг не можна прочитати з CSS, тож він розійшовся б із
	 * сіткою на першій же зміні мінімуму колонки.
	 */
	.chain__sep {
		position: absolute;
		top: 1.875rem;
		right: -0.6rem;
		transform: translateY(-50%);
		color: var(--color-text-muted);
	}
</style>
