import { error } from '@sveltejs/kit';
import { LIBRARY, findArticle } from '$lib/data/library';
import { PREFIXED_LOCALES } from '$lib/i18n/locales';
import type { EntryGenerator, PageLoad } from './$types';

/**
 * Кожна стаття в кожній мові — інакше пререндер знайде лише ті, на які веде
 * посилання з уже відвіданої сторінки.
 */
export const entries: EntryGenerator = () =>
	[undefined, ...PREFIXED_LOCALES].flatMap((lang) =>
		LIBRARY.map((a) => ({ lang, slug: a.slug }) as { lang: string; slug: string })
	);

export const load: PageLoad = ({ params }) => {
	const article = findArticle(params.slug);
	if (!article) error(404, 'Article not found');
	return { article };
};
