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
	praktikumListEmpty,
} from '../classes/praktikum';
import { Result } from '../classes/result';
import { match, matchI } from 'ts-adt';

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

	async getPraktikumData(masterSheetID: string): Promise<any> {
		const cachedData = await this.dataStore.fetch();

		// If cacheData is empty, then fetch again and return
		matchI(cachedData)({
			empty: async () => {
				const fetchData = await this.fetchSheets(masterSheetID);
				return matchI(fetchData)({
					empty: () => {
						return praktikumListEmpty();
					},
					failure: ({ value }) => {
						return praktikumListFailure(value);
					},
					success: ({ value }) => {
						return praktikumListSuccess(value);
					},
				});
			},
			failure: ({ value }) => {
				return praktikumListFailure(value);
			},
			success: ({ value }) => {
				if (Date.now() - value.time > 3600 * 1000) {
					
				}
				return cachedData;
			},
		});
	}

	async fetchSheets(masterSheetID: string): Promise<PraktikumList> {
		const masterSheetData = await this.fetchMasterSheet(masterSheetID);

		// If master sheet failed, then return the failure
		// else, return data as empty or success
		return matchI(masterSheetData)({
			failure: ({ value }) => {
				return praktikumListFailure(value.error);
			},
			success: async ({ value }) => {
				const data = await this.fetchOtherSheets(value);
				if (isUndefined(data) || isEmpty(data)) {
					return praktikumListEmpty();
				}
				return praktikumListSuccess(data);
			},
		});
	}

	private async fetchMasterSheet(masterSheetId: string): Promise<Praktikum> {
		return this.sheetsAPI.fetchSheetPraktikum(
			'Master Sheet',
			masterSheetId,
			'0',
			1
		);
	}

	private async fetchOtherSheets(
		praktikum: PraktikumSuccess
	): Promise<Praktikum[]> {
		return Promise.all<Praktikum>(
			praktikum.data.map(async (sheet: object) => {
				return this.sheetsAPI.fetchSheetPraktikum(
					sheet['gsx$namapraktikum']['$t'],
					sheet['gsx$sheetid']['$t'],
					sheet['gsx$gid']['$t'],
					parseSheetIndex(sheet['gsx$namapraktikum']['$t'])
				);
			})
		);
	}
}
