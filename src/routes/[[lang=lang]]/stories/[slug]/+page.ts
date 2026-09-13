import { error } from '@sveltejs/kit';
import { STORIES, findStory } from '$lib/data/stories';
import { PREFIXED_LOCALES } from '$lib/i18n/locales';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	[undefined, ...PREFIXED_LOCALES].flatMap((lang) =>
		STORIES.map((s) => ({ lang, slug: s.slug }) as { lang: string; slug: string })
	);

export const load: PageLoad = ({ params }) => {
	const story = findStory(params.slug);
	if (!story) error(404, 'Story not found');
	return { story };
};
