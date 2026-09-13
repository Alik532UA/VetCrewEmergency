import type { Localized } from './library/types';

/**
 * Історії порятунку.
 *
 * Тексти — рівно ті, що надав автор у специфікації: заголовок і абзац. Довших
 * версій у матеріалах немає, і вигадувати їх не можна: це розповіді про
 * конкретних тварин і конкретних людей, які їх рятували. Вигадана подробиця в
 * такому тексті — не «заповнення сторінки», а неправда про чужу роботу.
 *
 * Тому сторінка історії показує те, що є, і не вдає обсягу: заголовок, абзац,
 * рік і заклик допомогти. Коли надійдуть повні тексти й знімки, поле `body`
 * отримає їх, а сторінка — не зміниться ні на рядок.
 */
export interface RescueStory {
	/** Сегмент адреси. Стабільний назавжди. */
	slug: string;
	emoji: string;
	title: Localized;
	/** Абзац зі специфікації — він же анонс на головній і на сторінці. */
	summary: Localized;
	/** Повний текст, коли надійде. Порожній масив — це «ще немає», а не «нема чого». */
	body: readonly Localized[];
}

export const STORIES: readonly RescueStory[] = [
	{
		slug: 'owl-broken-wing',
		emoji: '🦉',
		title: { uk: 'Сова зі зламаним крилом', en: 'The owl with a broken wing' },
		summary: {
			uk: 'Врятована українськими військовими на фронті. Після складного лікування та тривалої реабілітації повернулася у дику природу.',
			en: 'Rescued by Ukrainian soldiers at the front. After complex treatment and a long rehabilitation she returned to the wild.'
		},
		body: []
	},
	{
		slug: 'beach-monkey',
		emoji: '🐒',
		title: { uk: 'Мавпа з пляжу', en: 'The monkey from the beach' },
		summary: {
			uk: 'Її експлуатували для фото з туристами. Історія, яка показує, що насправді стоїть за такими розвагами. Після порятунку вона вперше отримала шанс жити так, як має жити дика тварина.',
			en: 'She was exploited for photos with tourists. A story of what such entertainment really costs. After the rescue she got her first chance to live as a wild animal should.'
		},
		body: []
	},
	{
		slug: 'marten-in-netting',
		emoji: '🦡',
		title: { uk: 'Куниця з антидронової сітки', en: 'The marten in anti-drone netting' },
		summary: {
			uk: 'Заплуталася в антидроновій сітці на фронті. Попереду чекали складна операція та довге відновлення.',
			en: 'Tangled in anti-drone netting at the front. A complex surgery and a long recovery lay ahead.'
		},
		body: []
	},
	{
		slug: 'honey-buzzard',
		emoji: '🦅',
		title: { uk: 'Осоїд після обстрілу', en: 'The honey buzzard after shelling' },
		summary: {
			uk: 'Знайдений контуженим на вулицях міста після обстрілу. Після складної реабілітації повернувся у дику природу.',
			en: 'Found concussed on city streets after shelling. After a difficult rehabilitation he returned to the wild.'
		},
		body: []
	},
	{
		slug: 'hedgehog-family',
		emoji: '🦔',
		title: { uk: 'Родина їжаків після ДТП', en: 'The hedgehog family after a road accident' },
		summary: {
			uk: 'Після аварії мама-їжачиха боролася за життя, а її малюки чекали поруч. Зрештою вся родина повернулася у дику природу.',
			en: 'After the crash the mother hedgehog fought for her life while her young waited beside her. In the end the whole family returned to the wild.'
		},
		body: []
	},
	{
		slug: 'roe-calves-front',
		emoji: '🦌',
		title: { uk: 'Козулята з фронту', en: 'The roe deer calves from the front' },
		summary: {
			uk: 'Війна назавжди змінила їхнє життя. Сьогодні їхнім домом став наш Центр довічної опіки.',
			en: 'The war changed their lives for good. Today our lifetime care centre is their home.'
		},
		body: []
	},
	{
		slug: 'roe-deer-accident',
		emoji: '🫎',
		title: { uk: 'Козуля після ДТП', en: 'The roe deer after a road accident' },
		summary: {
			uk: 'Отримала важкі травми, але після лікування та реабілітації повернулася туди, де її справжній дім — у дику природу.',
			en: 'She suffered severe injuries, but after treatment and rehabilitation she returned where she truly belongs — the wild.'
		},
		body: []
	}
];

export const findStory = (slug: string): RescueStory | undefined =>
	STORIES.find((s) => s.slug === slug);
