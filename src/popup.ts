import { browser } from 'webextension-polyfill-ts';
import { isEmpty } from 'lodash';
import { FetchSheetsAPI } from './fetch_sheets_api';
import { SheetsAPI } from './core/sheets_api';

const searchButton = document.getElementById('search_button');
const refreshButton = document.getElementById('refresh_button');
const masterSheet = '1n9B0q-SOT8q7f_jaTGjYq7WrvGxsGKwpJ4ho8V6VAZg';
const dummySheet = '1gy9XBOyANahh12NYR1vK9cHMYQrhRkdysh15BpqzWLQ'

const sheetsAPI : SheetsAPI = new FetchSheetsAPI();

document.addEventListener('DOMContentLoaded', async () => {
	var a = await browser.storage.local.get('unknown');

	if (isEmpty(a)) {
		const data = await sheetsAPI.fetchSheet(dummySheet, 3).catch(console.log);
		console.log(data);
	}
});

searchButton.addEventListener('click', async () => {});

refreshButton.addEventListener('click', async () => {
	sheetsAPI.fetchSheetsFrom(masterSheet);
});
