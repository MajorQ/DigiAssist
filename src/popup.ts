import { BrowserDataStore } from './data/data_store';
import { Repository } from './data/repository';
import { FetchSheetsAPI } from './data/sheets_api';
import * as UI from './ui';
import { LinkSheetADT, Praktikum, PraktikumADT } from './classes/praktikum';
import { isEmpty } from 'lodash';
import { matchI } from 'ts-adt';
import { searchPraktikan } from './domain/search_use_case';

const searchButton = document.getElementById('search_button');
const refreshButton = document.getElementById('refresh_button');

const linkSheetID = '1INKbXKbih8q-JwNm74zjVThU7f75EpA4Pwh1niX6iQw';
const repository = new Repository(new BrowserDataStore(), new FetchSheetsAPI());

let praktikumList: Praktikum[];

document.addEventListener('DOMContentLoaded', async () => {
	UI.toggleLoading(UI.State.BUSY);
	UI.clearResults();
	const praktikumData = await repository.getPraktikumData(linkSheetID);
	// console.log(praktikumData);
	
	await refresh(praktikumData);
	UI.toggleLoading(UI.State.IDLE);
});

// TODO: choose praktikum

searchButton.addEventListener('click', async () => {
	const NPMField = (document.getElementById(
		'npm_text_field'
	) as HTMLInputElement).value;
	const modul = (document.getElementById('modul_dropdown') as HTMLInputElement)
		.value;

	UI.clearResults();

	const results = searchPraktikan(NPMField, praktikumList, modul);
	if (isEmpty(results)) {
		UI.showError('NPM was not found!');
	} else {
		results.forEach((result) => UI.createResultBox(result));
	}
});

refreshButton.addEventListener('click', async () => {
	UI.toggleLoading(UI.State.BUSY);
	const praktikumData = await repository.fetchPraktikumData(linkSheetID);
	await refresh(praktikumData);
	UI.toggleLoading(UI.State.IDLE);
});

async function refresh(praktikumData: LinkSheetADT) {
	praktikumList = [];

	matchI(praktikumData)({
		failure: ({ value: linkSheet }) => {
			UI.showError(`Could not access Link Sheet ${linkSheet.message}`);
		},
		success: ({ value: linkSheet }) => {
			linkSheet.forEach((child) => {
				matchI(child)({
					failure: ({ value: childSheet }) => {
						UI.showError(
							`Could not access ${childSheet.name} ${childSheet.error.message}`
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
