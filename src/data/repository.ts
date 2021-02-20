import { DataStore } from './data_store';
import { SheetsAPI } from './sheets_api';
import { isEmpty } from 'lodash';

import { getColumn, parseSheetIndex } from '../utils';
import {
	Praktikum,
	PraktikumFailure,
	PraktikumSuccess,
} from '../classes/praktikum';
import * as E from '../lib/either';
import { Result } from '../classes/result';

export class Repository {
	constructor(private dataStore: DataStore, private sheetsAPI: SheetsAPI) {}

	searchPraktikan(
		inputNPM: string,
		praktikumList: Praktikum[],
		modul: string
	): Result {
		for (let praktikum of praktikumList) {
			if (E.isRight(praktikum)) {
				const data = praktikum.right.data;
				const index = data.findIndex(
					(praktikan) => praktikan['gsx$npm']['$t'] === inputNPM
				);
				if (index !== -1) {
					return {
						name: data[index]['gsx$nama']['$t'],
						row: index + 2,
						column: getColumn(data[index]['content']['$t'], modul),
						praktikum: praktikum.right,
					};
				}
			}
		}
	}

	async getPraktikumData(
		masterSheetID: string
	): Promise<E.Either<PraktikumFailure, Praktikum[]>> {
		const cachedData = await this.dataStore.fetch();

		if (isEmpty(cachedData)) {
			const data = await this.fetchSheets(masterSheetID);

			if (E.isRight(data)) {
				this.dataStore.store(data.right);
			}

			return data;
		}

		if (Date.now() - cachedData.time > 3600 * 1000) {
			const data = await this.fetchSheets(masterSheetID);

			if (E.isRight(data)) {
				this.dataStore.store(data.right);
			}

			return data;
		}

		return E.right(cachedData.praktikum);
	}

	async fetchSheets(
		masterSheetID: string
	): Promise<E.Either<PraktikumFailure, Praktikum[]>> {
		const result = await this.fetchMasterSheet(masterSheetID);

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
