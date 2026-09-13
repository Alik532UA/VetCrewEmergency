<script lang="ts">
	import { t } from '$lib/i18n';
	import Icon from '$lib/components/ui/Icon.svelte';

	/**
	 * П'ять кроків порятунку — ряд кружків зі значками.
	 *
	 * Кружок із обведенням, а не квадратна картка: у референсі цей ряд єдиний,
	 * хто читається як лінія кроків, а не як перелік карток. Картки на сторінці
	 * вже є вище й нижче, і третій їхній ряд перетворив би сторінку на сітку
	 * прямокутників без жодної ієрархії.
	 *
	 * Нумерації немає навмисно. Вона була б третім способом сказати те, що вже
	 * кажуть порядок зліва направо й самі тексти («Ви повідомляєте» → «Ми
	 * оцінюємо»), і на вузькому екрані, де ряд стає стовпцем, цифри лишилися б
	 * єдиним, що тримає порядок — тобто взяли б на себе роботу, якої в них немає.
	 */
	const steps = [
		{ icon: 'phone', title: 'how.step1.title', text: 'how.step1.text' },
		{ icon: 'view', title: 'how.step2.title', text: 'how.step2.text' },
		{ icon: 'ambulance', title: 'how.step3.title', text: 'how.step3.text' },
		{ icon: 'pulse', title: 'how.step4.title', text: 'how.step4.text' },
		{ icon: 'tree', title: 'how.step5.title', text: 'how.step5.text' }
	] as const;
</script>

<ol class="steps">
	{#each steps as step, i (step.title)}
		<li class="step">
			<span class="step__badge" aria-hidden="true">
				<Icon name={step.icon} size="1.6rem" />
			</span>
			<h3 class="step__title">{t(step.title)}</h3>
			<p class="step__text">{t(step.text)}</p>
			<!-- Стрілка між кроками, як у «Шляху тварини»: ряд кружків без неї читається
				 як перелік рівноцінних пунктів, а це послідовність. Остання не має куди
				 вести, тож її немає. Розмітка декоративна — порядок уже несе сам список. -->
			{#if i < steps.length - 1}
				<span class="step__sep" aria-hidden="true">
					<Icon name="chevron-right" size="1.25rem" />
				</span>
			{/if}
		</li>
	{/each}
</ol>

<style>
	.steps {
		display: grid;
		gap: 1.5rem 1rem;
		grid-template-columns: repeat(auto-fit, minmax(min(10rem, 100%), 1fr));
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.step {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		/* Місце під стрілку праворуч: без нього вона лягає на текст сусіда. Те саме
		   число, що в `.chain__item` — ряди мусять читатися як один прийом. */
		padding: 0 1.5rem;
		text-align: center;
	}

	.step__sep {
		position: absolute;
		top: 2.125rem;
		right: -0.6rem;
		transform: translateY(-50%);
		color: var(--color-text-muted);
	}

	.step__badge {
		display: grid;
		place-items: center;
		width: 4.25rem;
		height: 4.25rem;
		margin-bottom: 0.4rem;
		border: var(--border-width) solid var(--color-accent);
		border-radius: 50%;
		color: var(--color-accent);
	}

	.step__title {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 700;
		line-height: 1.3;
	}

	.step__text {
		margin: 0;
		font-size: 0.9rem;
		color: var(--color-text-muted);
	}
</style>
