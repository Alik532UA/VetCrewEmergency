/**
 * Бере піддерево й виводить усе фокусоване в ньому з черги табуляції.
 *
 * Потрібне там, де розмітку дублюють задля вигляду, а копію ховають від читалок:
 * `aria-hidden` навколо елемента, на який можна перейти клавішею Tab, — це
 * порушення WCAG 4.1.2. Людина з клавіатурою потрапляє у вміст, про який читалка
 * мовчить, і не розуміє, де опинилася.
 *
 * `MutationObserver`, а не один прохід: копії стрічки перемальовуються, коли
 * змінюється їхня кількість, і нові вузли приходять уже після першого проходу.
 *
 * Форма — Svelte-attachment: повертає прибирання, яке компонент викличе сам.
 */
export function untabbable(node: HTMLElement) {
	const apply = () => {
		for (const el of node.querySelectorAll<HTMLElement>(
			'a, button, input, select, textarea, [tabindex]'
		)) {
			el.tabIndex = -1;
		}
	};

	apply();
	const observer = new MutationObserver(apply);
	observer.observe(node, { childList: true, subtree: true });

	return () => observer.disconnect();
}
