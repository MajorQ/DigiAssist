import { DataStore } from './data_store';
import { SheetsAPI } from './sheets_api';
import { isEmpty } from 'lodash';

import { parseSheetIndex } from '../utils';
import {
	Praktikum,
	PraktikumFailure,
	PraktikumSuccess,
} from '../classes/praktikum';
import * as E from '../lib/either';

export class Repository {
	constructor(
		private dataStore: DataStore,
		private sheetsAPI: SheetsAPI,
		private masterSheetId: string
	) {}

	async getPraktikumData(): Promise<E.Either<PraktikumFailure, Praktikum[]>> {
		const cachedData = await this.dataStore.fetch();

		if (isEmpty(cachedData)) {
			const data = await this.fetchSheets(this.masterSheetId);

			if (E.isRight(data)) {
				this.dataStore.store(data.right);
			}

			return data;
		}

		if (Date.now() - cachedData.cacheTime > 3600 * 1000) {
			const data = await this.fetchSheets(this.masterSheetId);

			if (E.isRight(data)) {
				this.dataStore.store(data.right);
			}

			return data;
		}

		return E.right(cachedData as Praktikum[]);
	}

	private async fetchSheets(
		masterSheetId: string
	): Promise<E.Either<PraktikumFailure, Praktikum[]>> {
		const result = await this.fetchMasterSheet(masterSheetId);

		if (E.isRight(result)) {
			return E.right(await this.fetchOtherSheets(result.right));
		} else {
			return E.left(result.left);
		}
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
