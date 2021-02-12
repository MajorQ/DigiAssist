import { browser } from 'webextension-polyfill-ts';
import { isEmpty } from 'lodash';
import * as func from './functions';

const search_button = document.getElementById('search_button');
const refresh_button = document.getElementById('refresh_button');

document.addEventListener('DOMContentLoaded', async () => {
	var a = await browser.storage.local.get('unknown');

	if (isEmpty(a)) {
		func.refresh();
	}
});

search_button.addEventListener('click', async () => {});

refresh_button.addEventListener('click', async () => {});
