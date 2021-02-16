import { DataStore } from './data_store';
import { SheetsAPI } from './sheets_api';
import { isEmpty } from 'lodash';

import { PraktikumModel } from './models/praktikum_model';
import { parseSheetIndex } from '../utils';

export class Repository {
	constructor(
		private dataStore: DataStore,
		private sheetsAPI: SheetsAPI,
		private masterSheetId: string
	) {}

	async getPraktikumData() {
		const cachedData = await this.dataStore.fetch();

		if (isEmpty(cachedData)) {
			const data = await this.fetchSheetsFrom(this.masterSheetId);
			this.dataStore.store(data);
			return data;
		}

		if (Date.now() - cachedData.cacheTime > 3600 * 1000) {
			const data = await this.fetchSheetsFrom(this.masterSheetId);
			this.dataStore.store(data);
			return data;
		}

		return cachedData;
	}

	searchPraktikan(name: string) {}

	private async fetchSheetsFrom(
		masterSheetId: string
	): Promise<PraktikumModel[]> {
		const sheets = await this.sheetsAPI
			.fetchSheet(masterSheetId, 1)
			.catch((err: Error) => {
				err.message = `Could not access Master Sheet ${err.message}`;
				throw err;
			});

		let result: PraktikumModel[] = [];
		await Promise.all(
			sheets.map(async (sheet: object) => {
				const praktikum = PraktikumModel.fromSheet(sheet);
				const data = await this.sheetsAPI
					.fetchSheet(
						praktikum.sheetId,
						parseSheetIndex(sheet['gsx$namapraktikum']['$t'])
					)
					.catch((err: Error) => {
						err.message = `Could not access ${praktikum.name} Sheet ${err.message}`;
						throw err;
					});
				result.push(praktikum.addData(data));
			})
		);
		return result;
	}
}
