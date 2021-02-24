import { has } from 'lodash';
import {
	FetchError,
	ResponseBodyShapeError,
	ResponseParseError,
} from '../classes/errors';
import {
	PraktikumADT,
	praktikumFailure,
	praktikumSuccess,
} from '../classes/praktikum';

export interface SheetsAPI {
	fetchSheet(sheet_id: string, sheet_index: number): Promise<object[]>;
	fetchSheetPraktikum(
		name: string,
		sheetID: string,
		gid: string,
		sheetIndex: number
	): Promise<PraktikumADT>;
}

export class FetchSheetsAPI implements SheetsAPI {
	async fetchSheet(sheetID: string, sheetIndex: number): Promise<object[]> {
		const url = `https://spreadsheets.google.com/feeds/list/${sheetID}/${sheetIndex}/public/values?alt=json`;

		const response = await fetch(url).catch(() => {
			throw new FetchError(0);
		});

		if (!response.ok || response.status !== 200) {
			throw new FetchError(response.status);
		}

		const result = await response.json().catch(() => {
			throw new ResponseParseError();
		});

		// first, check if response has the proper headers
		if (!has(result, 'feed') || !has(result['feed'], 'entry')) {
			throw new ResponseBodyShapeError();
		}

		// then, remove the sheet headers and only return the values inside the sheet
		return result['feed']['entry'];
	}

	async fetchSheetPraktikum(
		name: string,
		sheetID: string,
		gid: string,
		sheetIndex: number
	): Promise<PraktikumADT> {
		return this.fetchSheet(sheetID, sheetIndex)
			.then((data) => praktikumSuccess(name, sheetID, gid, data))
			.catch((error: Error) => praktikumFailure(name, error));
	}
}
