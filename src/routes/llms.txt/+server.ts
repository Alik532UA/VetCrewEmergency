import { absoluteLocale, INDEXED_PATHS, isHiddenRoute } from '$lib/config';
import { DEFAULT_LOCALE, LOCALES, PREFIXED_LOCALES } from '$lib/i18n/locales';
import { LIBRARY } from '$lib/data/library';
import { STORIES } from '$lib/data/stories';

/**
 * `llms.txt` — що це за сайт, для моделі, яка його читає.
 *
 * Числа тут ОБЧИСЛЮЮТЬСЯ з реєстрів, а не написані словами. Саме написані
 * числа й були дефектом у проєкті-джерелі: файл обіцяв моделям сторінки,
 * яких сайт ніколи не мав, і кількості, які давно змінилися. Обчислене число
 * не може застаріти — воно або правильне, або збірка падає.
 */
export const prerender = true;

/** Опис кожної індексованої сторінки. Ключ — шлях; зайвого ключа гейт не пустить. */
const BLURB: Record<string, { title: string; text: string }> = {
	'/': {
		title: 'Home',
		text: 'The 24/7 hotline, when to contact us, how a rescue works, and who we are.'
	},
	'/library': {
		title: 'What to do if…',
		text: 'Short field instructions for people who have just found a wild animal: whether to step in at all, when help is genuinely needed, and what never to do.'
	},
	'/stories': {
		title: 'Rescue stories',
		text: 'Individual animals that were rescued, treated and returned to the wild, or given lifetime care.'
	},
	'/about': {
		title: 'About us',
		text: 'The team, the veterinary hospital, the lifetime care centre, and the contacts.'
	},
	'/support': {
		title: 'Support us',
		text: 'Donations and the shop. Both links are still to be supplied.'
	}
};

export function GET() {
	const articles = LIBRARY.length;
	const stories = STORIES.length;

	const pages = INDEXED_PATHS.filter((path) => !isHiddenRoute(path)).map((path) => {
		const blurb = BLURB[path];
		return `- [${blurb.title}](${absoluteLocale(path, DEFAULT_LOCALE)}): ${blurb.text}`;
	});

	const body = `# Vet Crew Emergency Wildlife Response

> A 24/7 emergency service for wild animals in Ukraine: call-outs, veterinary treatment, rehabilitation and release, or lifetime care where release is impossible.

The main response area is the south of Ukraine; rescue and evacuation are coordinated nationwide. The site carries ${articles} field instructions and ${stories} rescue stories. It has no accounts, no login and no payments.

Every page exists in ${LOCALES.length} languages. ${DEFAULT_LOCALE.toUpperCase()} is served at the bare path and the rest under a prefix (${PREFIXED_LOCALES.map((locale) => `/${locale}`).join(', ')}), so the English version of any address below is the same path with /en in front of it.

## Main Pages

${pages.join('\n')}

## Individual pages

Each field instruction has a page at /library/<slug> with a one-sentence answer followed by four fixed questions: whether to intervene, when help is needed, what never to do, and when to call us. Each rescue story has a page at /stories/<slug>. All ${articles + stories} are listed in the sitemap; they are not repeated here because the sitemap is the copy that cannot fall behind.

## What this site is not

It is not a veterinary reference and not a substitute for a specialist. The instructions are deliberately conservative: in most cases the correct action is to leave the animal alone and call.
`;

	return new Response(body, {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
}
