
import { BrowserDataStore } from './data/data_store';
import { Repository } from './data/repository';
import { FetchSheetsAPI } from './data/sheets_api';

const searchButton = document.getElementById('search_button');
const refreshButton = document.getElementById('refresh_button');
const masterSheet = '1n9B0q-SOT8q7f_jaTGjYq7WrvGxsGKwpJ4ho8V6VAZg';
const dummySheet = '1gy9XBOyANahh12NYR1vK9cHMYQrhRkdysh15BpqzWLQ'

const repository = new Repository(new BrowserDataStore, new FetchSheetsAPI(), dummySheet);

document.addEventListener('DOMContentLoaded', async () => {
	// update the UI
	// fetch data from repository
});

searchButton.addEventListener('click', async () => {
	// search for praktikan from repository data
});

refreshButton.addEventListener('click', async () => {
});
