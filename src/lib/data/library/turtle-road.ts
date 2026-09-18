import type { LibraryArticle } from './types';

export const turtle_road: LibraryArticle = {
	slug: 'turtle-road',
	group: 'reptiles',
	emoji: '🐢',
	title: {
		uk: '…черепаха переходить дорогу?',
		en: '…a turtle is crossing the road?'
	},
	teaser: {
		uk: 'Перенести можна — але лише в той бік, куди вона йшла. Інакше вона повернеться й піде знову.',
		en: 'You may carry it across — but only the way it was heading. Otherwise it will turn back and set off again.'
	},
	answer: {
		uk: 'Перенесіть її через дорогу в тому напрямку, куди вона рухалася, і залиште там.',
		en: 'Carry it across in the direction it was already going, and leave it there.'
	},
	blocks: {
		intervene: {
			uk: 'Так, якщо вона на проїжджій частині й ви можете зробити це безпечно для себе.',
			en: 'Yes, if it is on the roadway and you can do so safely for yourself.'
		},
		whenHelp: {
			uk: 'Якщо панцир тріснутий чи пошкоджений, якщо є кров, якщо тварина не втягує голову й лап.',
			en: 'If the shell is cracked or damaged, if there is blood, if the animal does not draw in its head and legs.'
		},
		never: {
			uk: 'Не несіть її «в кращий ставок» і не забирайте додому: черепаха живе на своїй ділянці й шукатиме дорогу назад.',
			en: 'Do not carry it to “a better pond” or take it home: a turtle lives on its own patch and will look for the way back.'
		},
		whenCall: {
			uk: 'Якщо панцир пошкоджений або ви не впевнені, що це місцевий вид, а не покинута свійська.',
			en: 'If the shell is damaged, or you are not sure it is a wild local species rather than an abandoned pet.'
		}
	},
	story: {
		uk: 'Болотяна черепаха з тріщиною панцира після зустрічі з колесом: панцир зростається довго.',
		en: 'A pond turtle with a cracked shell after meeting a wheel: shells knit slowly.'
	},
	related: ['amphibian-found', 'snake-encounter', 'transport-mustelid']
};
