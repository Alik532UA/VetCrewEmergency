import type { BetaCheck } from '../types';

/**
 * Повідомлення про тварину, підтримка і сторінка «Про нас».
 *
 * Форми на сайті поки немає: «Повідомити про знахідку» веде в Telegram
 * (`REPORT_URL` у config.ts), а сторінка `/report` лежить у теці з підкресленням
 * і не збирається. Тому перевіряти треба не поля, а те, що людина справді
 * потрапила туди, куди кнопка обіцяла, — і що сторінка при цьому лишилася
 * відкритою.
 */
export const reportChecks: readonly BetaCheck[] = [
	{
		id: 'report_1',
		category: { uk: 'Повідомлення', en: 'Reporting' },
		text: {
			uk: 'Натисніть «Повідомити про знахідку» на першому екрані. Мусить відкритися Telegram — у НОВІЙ вкладці, а сама сторінка лишитися на місці.',
			en: 'Press “Report a sighting” in the hero. Telegram must open in a NEW tab, and the page itself must stay where it was.'
		},
		testid: 'hero-report-link',
		coverage: 'manual'
	},
	{
		id: 'report_2',
		category: { uk: 'Повідомлення', en: 'Reporting' },
		text: {
			uk: 'Пройдіться стрілками чотирьох карток під першим екраном і кнопкою в кінці будь-якої статті бібліотеки. Усі мусять вести в той самий Telegram, а не на різні адреси.',
			en: 'Follow the arrows on the four cards under the hero and the button at the end of any library article. All must lead to the same Telegram, not to different addresses.'
		},
		testid: 'article-report-btn',
		coverage: 'manual'
	},
	{
		id: 'report_3',
		category: { uk: 'Повідомлення', en: 'Reporting' },
		text: {
			uk: 'Поверніться з Telegram на вкладку із сайтом. Сторінка НЕ мусить бути перезавантажена: те, що ви читали, має лишитися відкритим на тому самому місці.',
			en: 'Come back from Telegram to the site tab. The page must NOT have reloaded: what you were reading must still be open at the same place.'
		},
		testid: 'hero-report-link',
		negative: true,
		coverage: 'manual'
	},
	{
		id: 'report_4',
		category: { uk: 'Підтримка', en: 'Support' },
		text: {
			uk: 'Відкрийте сторінку підтримки й натисніть кнопку пожертви. Мусить бути видно, куди саме веде кнопка, ще до натиску.',
			en: 'Open the support page and press the donate button. Where the button leads must be visible before the press.'
		},
		testid: 'support-donate-btn',
		coverage: 'manual'
	},
	{
		id: 'report_5',
		category: { uk: 'Про нас', en: 'About' },
		text: {
			uk: 'На сторінці «Про нас» перевірте адресу й пошту. Вони мусять збігатися з тими, що в підвалі головної.',
			en: 'On the “About” page check the address and the email. They must match the ones in the home page footer.'
		},
		coverage: 'testable'
	}
];
