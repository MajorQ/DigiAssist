import { browser } from 'webextension-polyfill-ts';
import { isEmpty } from 'lodash';
import * as func from './functions';

const search_button = document.getElementById('search_button');
const refresh_button = document.getElementById('refresh_button');

document.addEventListener('DOMContentLoaded', async () => {
	var a = await browser.storage.local.get('unknown');

	if (isEmpty(a)) {
		const data = await func
			.fetchSheet('1n9B0q-SOT8q7f_jaTGjYq7WrvGxsGKwpJ4ho8V6VAZg', 1)
			.catch((err: Error) => {
				return `Could not access Master Sheet ${err.message}`;
			});

		console.log(data);
		
	}
});

search_button.addEventListener('click', async () => {
	console.log('click lmao');
});

refresh_button.addEventListener('click', async () => {});
