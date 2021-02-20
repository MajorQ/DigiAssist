import { BrowserDataStore } from './data/data_store';
import { Repository } from './data/repository';
import { FetchSheetsAPI } from './data/sheets_api';
import { createResultBox, showError, State, toggleLoading } from './ui';
import {
	Praktikum,
} from './classes/praktikum';
import { isEmpty } from 'lodash';
import { browser } from 'webextension-polyfill-ts';

const searchButton = document.getElementById('search_button');
const refreshButton = document.getElementById('refresh_button');

// actual masterSheet
// '1n9B0q-SOT8q7f_jaTGjYq7WrvGxsGKwpJ4ho8V6VAZg'
//
// dummy Sheet
// '1gy9XBOyANahh12NYR1vK9cHMYQrhRkdysh15BpqzWLQ'

const masterSheetID = '1gy9XBOyANahh12NYR1vK9cHMYQrhRkdysh15BpqzWLQ';

const repository = new Repository(new BrowserDataStore(), new FetchSheetsAPI());

let praktikumList: [];

document.addEventListener('DOMContentLoaded', async () => {
	// toggleLoading(State.BUSY);

	// const masterSheetResult = await repository.getPraktikumData(masterSheetID);

	// // UGLY
	// if (isRight(masterSheetResult)) {
	// 	masterSheetResult.right.forEach((sheet) => {
	// 		if (isRight(sheet)) {
	// 		} else {
	// 			showError(`Could not access ${sheet.left.name} ${sheet.left.error}`);
	// 		}
	// 	});
	// } else {
	// 	showError(
	// 		`Could not access ${masterSheetResult.left.name} ${masterSheetResult.left.error}`
	// 	);
	// }

	// toggleLoading(State.IDLE);

	browser.storage.local.get(['unknownKey', 'unknownKey2']).then(console.log)

	// const a = new FetchSheetsAPI()
	// a.fetchSheet(masterSheetID, 3);
});

searchButton.addEventListener('click', async () => {
	const NPMField = (document.getElementById(
		'npm_text_field'
	) as HTMLInputElement).value;
	const modul = (document.getElementById(
		'praktikum_dropdown'
	) as HTMLInputElement).value;

	const results = repository.searchPraktikan(NPMField, praktikumList, modul);
	if (isEmpty(results)) {
		results.forEach((result) => createResultBox(result));
	} else {
		showError('NPM was not found!');
	}
});

refreshButton.addEventListener('click', async () => {
	toggleLoading(State.BUSY);
	toggleLoading(State.IDLE);
});
