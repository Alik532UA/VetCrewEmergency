import type { BetaCheck } from '../types';

/**
 * Повідомлення про тварину, підтримка і сторінка «Про нас».
 *
 * Форма повідомлення — найважливіша дія сайту після дзвінка, і перевіряти її
 * треба саме як дію: не «поля є», а «лист пішов і людина це побачила».
 */
export const reportChecks: readonly BetaCheck[] = [
	{
		id: 'report_1',
		category: { uk: 'Повідомлення', en: 'Reporting' },
		text: {
			uk: 'Заповніть форму повідомлення й надішліть. Мусить з’явитися підтвердження, що повідомлення пішло — тиша після натиску виглядає як поламана кнопка.',
			en: 'Fill in the report form and submit. A confirmation must appear — silence after the press looks like a broken button.'
		},
		testid: 'report-submit-btn',
		coverage: 'manual'
	},
	{
		id: 'report_2',
		category: { uk: 'Повідомлення', en: 'Reporting' },
		text: {
			uk: 'Спробуйте надіслати порожню форму. Вона НЕ мусить відправитися, а біля кожного незаповненого поля мусить з’явитися пояснення.',
			en: 'Try to submit an empty form. It must NOT send, and every unfilled field must show an explanation.'
		},
		testid: 'report-submit-btn',
		negative: true,
		coverage: 'manual'
	},
	{
		id: 'report_3',
		category: { uk: 'Підтримка', en: 'Support' },
		text: {
			uk: 'Відкрийте сторінку підтримки й натисніть кнопку пожертви. Мусить бути видно, куди саме веде кнопка, ще до натиску.',
			en: 'Open the support page and press the donate button. Where the button leads must be visible before the press.'
		},
		testid: 'support-donate-btn',
		coverage: 'manual'
	},
	{
		id: 'report_4',
		category: { uk: 'Про нас', en: 'About' },
		text: {
			uk: 'На сторінці «Про нас» перевірте адресу й пошту. Вони мусять збігатися з тими, що в підвалі головної.',
			en: 'On the “About” page check the address and the email. They must match the ones in the home page footer.'
		},
		coverage: 'testable'
	}
];
