import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { LIBRARY } from './index';

/**
 * Форма довгих текстів, що лежать у `bodies/*.json`.
 *
 * Ці файли потрапляють у типізований код через `asBody` — тобто через приведення
 * типу, бо `import` із JSON дає `kind: string`, а не наш союз. Приведення саме
 * нічого не перевіряє: воно лише обіцяє. Цей файл і є тим, що робить обіцянку
 * перевіреною — інакше зайвий пробіл у `"kind": "text "` доїхав би до сторінки, і
 * вона намалювала б порожнє місце, не сказавши нічого.
 *
 * Перевіряється форма, а не зміст: текст статей — робота автора, і тест не має про
 * нього думки. Єдине, на чому він наполягає, — що порожнього блоку не буває: блок,
 * який нічого не показує, це або помилка розбору, або забутий абзац.
 */

const DIR = resolve('src/lib/data/library/bodies');
const KINDS = new Set(['heading', 'text', 'list', 'note']);

const files = readdirSync(DIR).filter((f) => f.endsWith('.json'));

describe('довгі тексти статей', () => {
	it('перевірка жива: файли є і їх читає бібліотека', () => {
		// Тест, що не знайшов жодного файлу, зелений — і мовчазний рівно тоді, коли
		// каталог перейменували й сторінки лишилися без тексту.
		expect(files.length).toBeGreaterThan(0);

		const withBody = LIBRARY.filter((a) => a.body !== undefined);
		expect(withBody.length, 'жодна стаття не бере довгий текст').toBe(files.length);
	});

	it.each(files)('%s складається лише з відомих блоків', (file) => {
		const blocks = JSON.parse(readFileSync(resolve(DIR, file), 'utf8'));
		expect(Array.isArray(blocks), `${file}: не масив`).toBe(true);

		const bad: string[] = [];
		blocks.forEach((b: Record<string, unknown>, i: number) => {
			if (!KINDS.has(b.kind as string)) {
				bad.push(`#${i}: невідомий kind ${JSON.stringify(b.kind)}`);
				return;
			}
			/*
			 * Кожен рядок — двомовний об'єкт, а не рядок.
			 *
			 * Перша редакція клала сюди голі рядки, і сторінка брала з них `text[lang]`
			 * — тобто `undefined`. У DOM було вісімдесят сім абзаців, у кожного
			 * правильний колір і `opacity: 1`, а на екрані порожнеча: `textContent`
			 * порожній, висота нуль. Перевірка форми ловить це до браузера.
			 */
			const localized = (v: unknown, where: string) => {
				const o = v as Record<string, unknown> | null;
				if (!o || typeof o.uk !== 'string' || typeof o.en !== 'string')
					bad.push(`#${i}: ${where} не двомовний`);
				else if (!o.uk.trim() || !o.en.trim()) bad.push(`#${i}: ${where} порожній`);
			};

			if (b.kind === 'list') {
				const items = b.items as unknown[];
				if (!Array.isArray(items) || items.length === 0) bad.push(`#${i}: список без пунктів`);
				else items.forEach((x, k) => localized(x, `пункт ${k}`));
			} else {
				localized(b.text, 'текст');
			}
		});

		expect(bad, `${file}:\n${bad.join('\n')}`).toEqual([]);
	});

	it.each(files)('%s не притягнув розмітки з джерела', (file) => {
		// У даних лежить ТЕКСТ. Сторінка малює його без `{@html}`, тож розмітка звідси
		// не виконається — але з'явитися вона може лише через помилку розбору, і тоді
		// читач побачить на сторінці голі зірочки й `&nbsp;`.
		const raw = readFileSync(resolve(DIR, file), 'utf8');
		for (const junk of ['&nbsp;', '**', '<script', '<div']) {
			expect(raw.includes(junk), `${file} містить «${junk}»`).toBe(false);
		}
	});
});
