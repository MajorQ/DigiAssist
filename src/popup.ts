import { BrowserDataStore } from './data/data_store';
import { Repository } from './data/repository';
import { FetchSheetsAPI } from './data/sheets_api';
import * as UI from './ui';
import { PraktikumSuccess } from './classes/praktikum';
import { isEmpty } from 'lodash';
import { matchI } from 'ts-adt';

const searchButton = document.getElementById('search_button');
const refreshButton = document.getElementById('refresh_button');

// actual masterSheet
// '1n9B0q-SOT8q7f_jaTGjYq7WrvGxsGKwpJ4ho8V6VAZg'
//
// dummy Sheet
// '1gy9XBOyANahh12NYR1vK9cHMYQrhRkdysh15BpqzWLQ'

const masterSheetID = '1n9B0q-SOT8q7f_jaTGjYq7WrvGxsGKwpJ4ho8V6VAZg';

const repository = new Repository(new BrowserDataStore(), new FetchSheetsAPI());

let praktikumList: PraktikumSuccess[] = [];

document.addEventListener('DOMContentLoaded', async () => {
	UI.toggleLoading(UI.State.BUSY);

	const masterSheetResult = await repository.getPraktikumData(masterSheetID);

	matchI(masterSheetResult)({
		failure: ({ value: masterSheetValue }) => {
			UI.showError(`Could not access Master Sheet ${masterSheetValue.message}`);
		},
		success: ({ value: masterSheetValue }) => {
			masterSheetValue.forEach((child) => {
				matchI(child)({
					failure: ({ value: childValue }) => {
						UI.showError(
							`Could not access ${childValue.name} ${childValue.error.message}`
						);
					},
					success: ({ value: childValue }) => {
						praktikumList.push(childValue);
					},
				});
			});
		},
	});

	UI.toggleLoading(UI.State.IDLE);
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
		results.forEach((result) => UI.createResultBox(result));
	} else {
		UI.showError('NPM was not found!');
	}
});

refreshButton.addEventListener('click', async () => {
	UI.toggleLoading(UI.State.BUSY);
	UI.toggleLoading(UI.State.IDLE);
});
