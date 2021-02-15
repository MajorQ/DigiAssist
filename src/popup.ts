import { browser } from 'webextension-polyfill-ts';
import { isEmpty } from 'lodash';
import { GoogleSheetAPI as api} from './sheets_api';

const searchButton = document.getElementById('search_button');
const refreshButton = document.getElementById('refresh_button');
const masterSheet = '1n9B0q-SOT8q7f_jaTGjYq7WrvGxsGKwpJ4ho8V6VAZg';

document.addEventListener('DOMContentLoaded', async () => {
	var a = await browser.storage.local.get('unknown');

	if (isEmpty(a)) {
		api.fetchSheetsFrom(masterSheet)
	}
});

searchButton.addEventListener('click', async () => {});

refreshButton.addEventListener('click', async () => {
	api.fetchSheetsFrom(masterSheet);
});
