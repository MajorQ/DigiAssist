import { BrowserDataStore } from './data/data_store';
import { Repository } from './data/repository';
import { FetchSheetsAPI } from './data/sheets_api';
import * as UI from './ui';
import { PraktikumSuccess } from './classes/praktikum';
import { isEmpty } from 'lodash';
import { matchI } from 'ts-adt';

const searchButton = document.getElementById('search_button');
const refreshButton = document.getElementById('refresh_button');

const linkSheetID = '1INKbXKbih8q-JwNm74zjVThU7f75EpA4Pwh1niX6iQw';
const repository = new Repository(new BrowserDataStore(), new FetchSheetsAPI());

let praktikumList: PraktikumSuccess[] = [];

document.addEventListener('DOMContentLoaded', async () => {
	UI.toggleLoading(UI.State.BUSY);
	await refresh();
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
	await refresh();
	UI.toggleLoading(UI.State.IDLE);
});

async function refresh() {
	UI.clearResults();

	praktikumList = [];

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
