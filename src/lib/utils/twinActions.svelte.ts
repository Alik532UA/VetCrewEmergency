import { browser } from '$app/environment';

/**
 * Чи стоїть зараз на екрані інша копія пари «подзвонити / написати».
 *
 * Пара є тричі за сторінку: у шапці, на першому екрані й у підвалі. Шапка від
 * цього й відштовхується — вона кричить лише тоді, коли більше нікому: угорі
 * сторінки та в самому низу пару видно й так, а посередині вона є тільки в шапці.
 *
 * Рахується не прокручуванням, а видимістю самих кнопок. Число пікселів довелося б
 * тримати однаковим із висотою першого екрана, розкладкою підвала й кожним новим
 * розділом між ними — і воно розійшлося б із ними мовчки, на першій же правці
 * тексту. `IntersectionObserver` питає про те, про що йдеться насправді: видно
 * кнопки чи ні.
 */

/**
 * Висота шапки: усе, що під нею, вважається невидимим.
 *
 * Без цього кнопки першого екрана лишалися б «на екрані» ще 72 пікселі після того,
 * як заїхали під непрозору смугу, і шапка стояла б тихою над власною копією.
 * Те саме число, що `height` у `HeaderNav.svelte` і `scroll-margin-top` у `base.css`.
 */
const HEADER_HEIGHT = 72;

/** Що дія `twin` розповідає про свою пару. */
export interface TwinSighting {
	/** Чи пара зараз на екрані. */
	onScreen: boolean;
	/**
	 * Скільки разів вона на нього потрапляла — від завантаження сторінки, не від
	 * першого візиту.
	 *
	 * Рахується в пам'яті навмисно: у сховищі це означало б, що людина, яка
	 * повернулася на сайт наступного дня, більше ніколи не побачить довшої першої
	 * черги маячка. Показати її ще раз — дешевше, ніж пояснити, чому її немає.
	 */
	times: number;
}

let onScreen = $state(0);
/**
 * Доки спостерігач не озвався хоч раз, вважаємо, що пару видно.
 *
 * Протилежне припущення дало б спалах: сторінка малюється з гучною шапкою, за
 * кадр приходить перша відповідь спостерігача, і на очах у читача червона кнопка
 * секунду згасає в контур. `IntersectionObserver` озивається на кожну ціль одразу
 * після `observe`, тож ця мить триває один кадр, а не довше.
 */
let pending = $state(true);

/** Читається компонентами; сам лічильник назовні не віддається. */
export const twinActions = {
	/** true — пару видно деінде, шапці кричати нема потреби. */
	get visible(): boolean {
		return pending || onScreen > 0;
	}
};

let observer: IntersectionObserver | null = null;

/** Що саме зараз перетинає екран, скільки разів перетинало і кому про це казати. */
interface Watched {
	onScreen: boolean;
	times: number;
	report?: (sighting: TwinSighting) => void;
}
const watched = new WeakMap<Element, Watched>();

function ensureObserver(): IntersectionObserver | null {
	if (!browser) return null;
	observer ??= new IntersectionObserver(
		(entries) => {
			pending = false;
			for (const entry of entries) {
				const seen = watched.get(entry.target);
				if (!seen || seen.onScreen === entry.isIntersecting) continue;

				seen.onScreen = entry.isIntersecting;
				if (entry.isIntersecting) seen.times += 1;
				onScreen += entry.isIntersecting ? 1 : -1;
				seen.report?.({ onScreen: seen.onScreen, times: seen.times });
			}
		},
		// Нуль, а не половина: поки з кнопки видно хоч смужку, вона на екрані є, і
		// друга така сама в шапці була б зайвою.
		{ threshold: 0, rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px` }
	);
	return observer;
}

/**
 * Дія для контейнера з парою кнопок: `<div use:twin>`.
 *
 * Вішається на групу, а не на кожну кнопку: кнопки в парі стоять поруч і зникають
 * з екрана разом, тож дві цілі замість однієї дали б ту саму відповідь удвічі.
 *
 * Необов'язковий аргумент — куди доповідати про появу пари. Ним користується
 * тимчасовий маячок: йому треба знати не «чи видно десь», а «чи видно САМЕ цю» і
 * вкотре, щоб перша черга була довша за наступні.
 */
export function twin(node: HTMLElement, report?: (sighting: TwinSighting) => void) {
	const io = ensureObserver();
	watched.set(node, { onScreen: false, times: 0, report });
	io?.observe(node);

	return {
		update(next?: (sighting: TwinSighting) => void) {
			const seen = watched.get(node);
			if (seen) seen.report = next;
		},
		destroy() {
			io?.unobserve(node);
			// Ціль, що пішла зі сторінки, лишила б лічильник назавжди піднятим — а це
			// шапка, яка мовчить до перезавантаження.
			if (watched.get(node)?.onScreen) onScreen -= 1;
			watched.delete(node);
		}
	};
}

/**
 * Скільки черг має дати маячок цієї пари.
 *
 * `infinite` — постійний режим, як було. У тимчасовому перша поява дістає три
 * черги, кожна наступна одну: перший раз маячок мусить пояснити, що він таке, а
 * далі лише нагадати.
 */
export function beaconRuns(mode: string, times: number): string {
	if (mode !== 'temporary') return 'infinite';
	return times <= 1 ? '3' : '1';
}
