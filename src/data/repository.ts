import { DataStore } from './data_store';
import { SheetsAPI } from './sheets_api';
import { isEmpty, isUndefined } from 'lodash';

import { getColumn, getURL, parseSheetIndex } from '../utils';
import {
	Praktikum,
	PraktikumSuccess,
	PraktikumList,
	praktikumListFailure,
	praktikumListSuccess,
} from '../classes/praktikum';
import { Result } from '../classes/result';
import { matchI, matchPI } from 'ts-adt';
import { success } from '../../test/fixtures/responses';

export class Repository {
	constructor(private dataStore: DataStore, private sheetsAPI: SheetsAPI) {}

	searchPraktikan(
		inputNPM: string,
		praktikumList: PraktikumSuccess[],
		modul: string
	): Result[] {
		let results: Result[];
		praktikumList.forEach((praktikum) => {
			const data = praktikum.data;
			const index = data.findIndex(
				(praktikan) => praktikan['gsx$npm']['$t'] === inputNPM
			);
			if (index !== -1) {
				results.push({
					name: data[index]['gsx$nama']['$t'],
					prak_name: praktikum.name,
					url: getURL(
						praktikum.sheetID,
						praktikum.gid,
						getColumn(data[index]['content']['$t'], modul),
						index + 2
					),
				});
			}
		});
		return results;
	}

	async getPraktikumData(masterSheetID: string): Promise<PraktikumList> {
		const cachedData = await this.dataStore.fetch();

		return matchPI(cachedData)(
			{
				success: ({ value }) => {
					if (Date.now() - value.time > 3600 * 1000) {
						return this.fetchAndStoreSheets(masterSheetID);
					}
					return praktikumListSuccess(value.praktikumList);
				},
			},
			() => {
				return this.fetchAndStoreSheets(masterSheetID);
			}
		);
	}

	async fetchAndStoreSheets(masterSheetID: string): Promise<PraktikumList> {
		const masterSheetData = await this.fetchMasterSheet(masterSheetID);

		// If master sheet failed, then return the failure
		// else, return data as empty or success
		return matchI(masterSheetData)({
			failure: ({ value }) => {
				return praktikumListFailure(value.error);
			},
			success: async ({ value }) => {
				const fetchData = await this.fetchOtherSheets(value.data);
				this.dataStore.store(fetchData);
				return praktikumListSuccess(fetchData);
			},
		});
	}

	private fetchMasterSheet(masterSheetId: string): Promise<Praktikum> {
		return this.sheetsAPI.fetchSheetPraktikum(
			'Master Sheet',
			masterSheetId,
			'0',
			1
		);
	}

	// TODO: this may fail
	private fetchOtherSheets(
		praktikumList: object[]
	): Promise<Praktikum[]> {
		return Promise.all<Praktikum>(
			praktikumList.map((sheet: object) => {
				return this.sheetsAPI.fetchSheetPraktikum(
					sheet['gsx$namapraktikum']['$t'],
					sheet['gsx$sheetid']['$t'],
					sheet['gsx$gid']['$t'],
					parseSheetIndex(sheet['gsx$sheetindex']['$t'])
				);
			})
		);
	}
}
