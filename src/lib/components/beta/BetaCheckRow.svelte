<script lang="ts">
	import { betaProgress, type Vote } from '$lib/controllers/betaProgress.svelte';
	import type { BetaCheck } from '$lib/data/beta/types';
	import { BETA_UI, pick } from '$lib/data/beta/ui';

	interface Props {
		check: BetaCheck;
		/** Drawn from the position in the list, never stored in the text (§ 2.2). */
		number: number;
		locale: string;
	}

	let { check, number, locale }: Props = $props();

	const VOTES: Vote[] = ['ok', 'fail', 'unclear', 'skip'];

	const mark = $derived(betaProgress.marks[check.id]);
	const stale = $derived(betaProgress.isStale(check.id));

	/**
	 * Локатор бере `id` пункта в kebab-case (§ 5.6, `BETA-LOCATOR-PER-CHECK`).
	 *
	 * Доти `check.id` підставлявся ЯК Є, і `common_1` давав
	 * `beta-check-common_1-item` — назву, яку TESTID-AND-NAMING § 1.2 забороняє.
	 * Обидва правила стояли в каноні, і не падало жодне: за форму `id` і за
	 * форму локатора відповідали різні перевірки, а перехід одного в друге не
	 * дивився ніхто. Заміна `_` → `-` однозначна в обидва боки, тож локатор
	 * лишається ПОХІДНИМ від `id`, а не другим іменем.
	 */
	const tid = $derived(check.id.replace(/_/g, '-'));
</script>

<li
	class="row"
	class:row--ok={mark?.vote === 'ok'}
	class:row--fail={mark?.vote === 'fail'}
	class:row--unclear={mark?.vote === 'unclear'}
	class:row--skip={mark?.vote === 'skip'}
	data-testid="beta-check-{tid}-item"
>
	<p class="row__category" data-testid="beta-check-{tid}-category-text">
		{number}. {pick(check.category, locale)}
		{#if check.negative}
			<span class="row__boundary">{locale === 'uk' ? 'межа' : 'boundary'}</span>
		{/if}
	</p>

	<p class="row__text" data-testid="beta-check-{tid}-text">{pick(check.text, locale)}</p>

	{#if stale}
		<p class="row__stale" data-testid="beta-check-{tid}-stale-hint">
			{pick(BETA_UI.stale, locale)}: v{mark.version}
		</p>
	{/if}

	<div class="row__votes">
		{#each VOTES as vote (vote)}
			<button
				type="button"
				class="row__vote row__vote--{vote}"
				class:row__vote--chosen={mark?.vote === vote}
				class:row__vote--stale={mark?.vote === vote && stale}
				onclick={() => betaProgress.vote(check.id, vote)}
				aria-pressed={mark?.vote === vote}
				data-testid="beta-vote-{tid}-{vote}-btn"
			>
				{pick(BETA_UI.votes[vote], locale)}
			</button>
		{/each}
	</div>
</li>

<style>
	.row {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		padding: var(--space-lg);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
		background: var(--control-surface);
	}

	.row.row--ok {
		border-color: #22c55e;
		border-width: 2px;
	}
	.row.row--fail {
		border-color: #ef4444;
		border-width: 2px;
	}
	.row.row--unclear {
		border-color: #eab308;
		border-width: 2px;
	}
	.row.row--skip {
		border-color: #3b82f6;
		border-width: 2px;
	}

	.row__category {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-primary-on-surface);
	}

	.row__boundary {
		margin-left: var(--space-xs);
		padding: 0 var(--space-xs);
		border: var(--border-width) solid var(--color-primary-on-surface);
		border-radius: var(--radius-sm);
		font-size: 0.7rem;
		letter-spacing: 0;
	}

	.row__text {
		color: var(--color-text);
		line-height: 1.5;
	}

	.row__stale {
		font-size: 0.85rem;
		font-style: italic;
		color: var(--color-text-muted);
	}

	.row__votes {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	/*
	 * State is carried by border weight and font weight as well as colour: a middle
	 * state told apart only by hue is not there at all for a reader who cannot
	 * separate hues (ACCESSIBILITY-v8 § 6, WCAG 1.4.1).
	 */
	.row__vote {
		--vote-ok: #22c55e;
		--vote-fail: #ef4444;
		--vote-unclear: #eab308;
		--vote-skip: #3b82f6;
		min-height: 44px;
		min-width: 44px;
		padding: 0 var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		cursor: pointer;
		font-size: 0.9rem;
		transition:
			border-color var(--transition-fast),
			background var(--transition-fast);
	}

	.row__vote:hover {
		border-color: var(--color-primary);
	}

	.row__vote--ok {
		background: color-mix(in srgb, var(--vote-ok) 8%, var(--color-bg-card));
		color: var(--color-text);
	}
	.row__vote--fail {
		background: color-mix(in srgb, var(--vote-fail) 8%, var(--color-bg-card));
		color: var(--color-text);
	}
	.row__vote--unclear {
		background: color-mix(in srgb, var(--vote-unclear) 8%, var(--color-bg-card));
		color: var(--color-text);
	}
	.row__vote--skip {
		background: color-mix(in srgb, var(--vote-skip) 8%, var(--color-bg-card));
		color: var(--color-text);
	}

	.row__vote--chosen {
		border-width: 4px;
		font-weight: 800;
	}

	.row__vote--chosen.row__vote--ok {
		border-color: var(--vote-ok);
		background: color-mix(in srgb, var(--vote-ok) 18%, var(--color-bg-card));
		color: var(--vote-ok);
	}
	.row__vote--chosen.row__vote--fail {
		border-color: var(--vote-fail);
		background: color-mix(in srgb, var(--vote-fail) 18%, var(--color-bg-card));
		color: var(--vote-fail);
	}
	.row__vote--chosen.row__vote--unclear {
		border-color: var(--vote-unclear);
		background: color-mix(in srgb, var(--vote-unclear) 18%, var(--color-bg-card));
		color: var(--vote-unclear);
	}
	.row__vote--chosen.row__vote--skip {
		border-color: var(--vote-skip);
		background: color-mix(in srgb, var(--vote-skip) 18%, var(--color-bg-card));
		color: var(--vote-skip);
	}

	/* A mark from an older build reads as provisional rather than done. */
	.row__vote--stale {
		opacity: 0.65;
		border-style: dotted;
	}
</style>
