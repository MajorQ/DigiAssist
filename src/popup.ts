import { BrowserDataStore } from './data/data_store';
import { Repository } from './data/repository';
import { FetchSheetsAPI } from './data/sheets_api';
import { createResultBox, showError, State, toggleLoading } from './ui';
import { Praktikum, PraktikumFailure } from './classes/praktikum';
import { Either, isRight } from './lib/either';

const searchButton = document.getElementById('search_button');
const refreshButton = document.getElementById('refresh_button');

// actual masterSheet
// '1n9B0q-SOT8q7f_jaTGjYq7WrvGxsGKwpJ4ho8V6VAZg'
//
// dummy Sheet
// '1gy9XBOyANahh12NYR1vK9cHMYQrhRkdysh15BpqzWLQ'

const masterSheetID = '1gy9XBOyANahh12NYR1vK9cHMYQrhRkdysh15BpqzWLQ';

const repository = new Repository(new BrowserDataStore(), new FetchSheetsAPI());

document.addEventListener('DOMContentLoaded', async () => {
	toggleLoading(State.BUSY);
	const result = await repository.getPraktikumData(masterSheetID);

	// UGLY
	if (isRight(result)) {
		for (let sheet of result.right) {
			if (isRight(sheet)) {
			} else {
				showError(`Could not access ${sheet.left.name} ${sheet.left.error}`);
			}
		}
	} else {
		showError(`Could not access ${result.left.name} ${result.left.error}`);
	}

	toggleLoading(State.IDLE);
});

searchButton.addEventListener('click', async () => {
	// search for praktikan from repository data
});

refreshButton.addEventListener('click', async () => {
	toggleLoading(State.BUSY);
	toggleLoading(State.IDLE);
});
