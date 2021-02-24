import { BrowserDataStore } from './data/data_store';
import { Repository } from './data/repository';
import { FetchSheetsAPI } from './data/sheets_api';
import * as UI from './ui';
import { Praktikum } from './classes/praktikum';
import { isEmpty } from 'lodash';
import { matchI } from 'ts-adt';

const searchButton = document.getElementById('search_button');
const refreshButton = document.getElementById('refresh_button');

const linkSheetID = '1INKbXKbih8q-JwNm74zjVThU7f75EpA4Pwh1niX6iQw';
const repository = new Repository(new BrowserDataStore(), new FetchSheetsAPI());

let praktikumList: Praktikum[];

document.addEventListener('DOMContentLoaded', async () => {
	UI.toggleLoading(UI.State.BUSY);
	await refresh();
	UI.toggleLoading(UI.State.IDLE);
});

// TODO: result is always not found
// TODO: undefined results after cache
// TODO: choose praktikum

searchButton.addEventListener('click', async () => {
	const NPMField = (document.getElementById(
		'npm_text_field'
	) as HTMLInputElement).value;
	const modul = (document.getElementById('modul_dropdown') as HTMLInputElement)
		.value;
 
	UI.clearResults();

	const results = repository.searchPraktikan(NPMField, praktikumList, modul);
	if (isEmpty(results)) {
		UI.showError('NPM was not found!');
	} else {
		results.forEach((result) => UI.createResultBox(result));
	}
});

refreshButton.addEventListener('click', async () => {
	UI.toggleLoading(UI.State.BUSY);
	await refresh();
	UI.toggleLoading(UI.State.IDLE);
});

async function refresh() {
	
	praktikumList = [];
	UI.clearResults();
	
	const masterSheetResult = await repository.getPraktikumData(linkSheetID);
	matchI(masterSheetResult)({
		failure: ({ value: linkSheetValue }) => {
			UI.showError(`Could not access Link Sheet ${linkSheetValue.message}`);
		},
		success: ({ value: linkSheetValue }) => {
			linkSheetValue.forEach((child) => {
				matchI(child)({
					failure: ({ value: childSheetValue }) => {
						UI.showError(
							`Could not access ${childSheetValue.name} ${childSheetValue.error.message}`
						);
					},
					success: ({ value: childSheetValue }) => {
						praktikumList.push(childSheetValue);
					},
				});
			});
		},
	});

	UI.createPraktikumDropdown(praktikumList);
}
