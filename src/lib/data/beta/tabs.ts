import type { BetaTab } from './types';
import { commonChecks } from './checks/common';
import { favoriteChecks } from './checks/favorites';
import { libraryChecks } from './checks/library';
import { reportChecks } from './checks/report';
import { storyChecks } from './checks/stories';
import { homeChecks } from './checks/home';

/**
 * The tabs of the checklist, each answering for the routes it names
 * (BETA-CHECKLIST-v8 § 5.1).
 *
 * Routes rather than a description of the feature, because the routes already exist on
 * disk: `src/fluid-sizing-canon.test.ts`-style scanning of `src/routes/` gives the full
 * list without anyone maintaining a second one, and an invariant then proves nothing was
 * left unclaimed. A page can be added to this site without touching this file — and the
 * unit tests will say so on the next run.
 *
 * `common` claims nothing on purpose: header, pickers, scrollbar and toasts are on every
 * page and belong to no single address.
 *
 * Order is the order a tester walks the site in: the chrome first, because it is what
 * they see before they see anything else.
 */
export const BETA_TABS: readonly BetaTab[] = [
	{
		id: 'common',
		title: { uk: 'Спільне для сайту', en: 'Shared across the site' },
		routes: [],
		checks: commonChecks
	},
	{
		id: 'home',
		title: { uk: 'Головна', en: 'Home' },
		routes: ['/'],
		checks: homeChecks
	},
	{
		id: 'library',
		title: { uk: 'Бібліотека порад', en: 'Advice library' },
		routes: ['/library', '/library/[slug]'],
		checks: libraryChecks
	},
	{
		id: 'stories',
		title: { uk: 'Історії порятунку', en: 'Rescue stories' },
		routes: ['/stories', '/stories/[slug]'],
		checks: storyChecks
	},
	{
		id: 'report',
		title: { uk: 'Повідомити про тварину', en: 'Reporting an animal' },
		routes: ['/report', '/support', '/about'],
		checks: reportChecks
	},
	{
		id: 'saved',
		title: { uk: 'Збережені поради', en: 'Saved advice' },
		routes: ['/saved'],
		checks: favoriteChecks
	}
];

/**
 * Routes that deliberately have no tab.
 *
 * An explicit list rather than a missing line (§ 5.1): «this address needs no
 * checklist» is a decision, and a decision that looks like an omission gets made again
 * by accident. The checklist does not check itself — an item about the page the tester
 * is standing on would be answered by the act of reading it.
 */
export const BETA_UNCOVERED_ROUTES: readonly string[] = ['/beta-test-checklists'];

/** Every check of every tab, flat — for the report and for the invariants. */
export const ALL_BETA_CHECKS = BETA_TABS.flatMap((tab) => tab.checks);
