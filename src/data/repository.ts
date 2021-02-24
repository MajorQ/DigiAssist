import { DataStore } from './data_store';
import { SheetsAPI } from './sheets_api';

import { parseSheetIndex } from '../utils';
import {
	PraktikumADT,
	Praktikum,
	LinkSheetADT,
	linkSheetFailure,
	linkSheetSuccess,
} from '../classes/praktikum';
import { matchI, matchPI } from 'ts-adt';

export class Repository {
	constructor(private dataStore: DataStore, private sheetsAPI: SheetsAPI) {}

	// 1. Seach praktikum from cache
	// 2. If cache is empty or failure then fetch the data
	async getPraktikumData(linkSheetID: string): Promise<LinkSheetADT> {
		const cachedData = await this.dataStore.fetch();
		return matchPI(cachedData)(
			{
				success: ({ value: cacheValue }) => {
					if (Date.now() - cacheValue.time > 3600 * 1000) {
						return this.fetchPraktikumData(linkSheetID);
					}
					return linkSheetSuccess(cacheValue.praktikumList);
				},
			},
			() => {
				return this.fetchPraktikumData(linkSheetID);
			}
		);
	}

	// 1. Fetches the link sheet
	// 2. If link sheet fails then return the failure
	// 3. On success then get sheets from that link sheet
	async fetchPraktikumData(linkSheetID: string): Promise<LinkSheetADT> {
		const linkSheetData = await this.fetchLinkSheet(linkSheetID);
		return matchI(linkSheetData)({
			failure: ({ value: linkSheetValue }) => {
				return linkSheetFailure(linkSheetValue.error);
			},
			success: async ({ value: linkSheetValue }) => {
				const fetchData = await this.fetchSheetsInArray(linkSheetValue);
				// NOTE: filter the data so that failures are not stored
				const dataToStore = fetchData.filter((praktikum: PraktikumADT) => {
					return matchI(praktikum)({
						failure: () => false,
						success: () => true,
					});
				});
				this.dataStore.store(dataToStore);
				return linkSheetSuccess(fetchData);
			},
		});
	}

	private fetchLinkSheet(linkSheetID: string): Promise<PraktikumADT> {
		// NOTE: The name and gid is never used, so it is left empty
		return this.sheetsAPI.fetchSheetPraktikum('', linkSheetID, '', 1);
	}

	// TODO: this may fail
	private fetchSheetsInArray(
		praktikumList: Praktikum
	): Promise<PraktikumADT[]> {
		const listData = praktikumList.data;
		return Promise.all<PraktikumADT>(
			listData.map((sheet: object) => {
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
