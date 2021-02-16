import { has } from 'lodash';
import {
	FetchError,
	ResponseBodyShapeError,
	ResponseParseError,
} from './classes/errors';
import { Praktikum, PraktikumBuilder } from './classes/praktikum';
import { SheetsAPI } from './core/sheets_api';
import { parseSheetIndex } from './utils';

export class FetchSheetsAPI implements SheetsAPI {
	async fetchSheet(sheet_id: string, sheet_index: number): Promise<object[]> {
		const url = `https://spreadsheets.google.com/feeds/list/${sheet_id}/${sheet_index}/public/values?alt=json`;

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

	async fetchSheetsFrom(masterSheetId: string): Promise<Praktikum[]> {
		const sheets = await this.fetchSheet(masterSheetId, 1).catch(
			(err: Error) => {
				const message = `Could not access Master Sheet ${err.message}`;
				throw new Error(message);
			}
		);

		let result: Praktikum[] = [];
		await Promise.all(
			sheets.map(async (sheet: object) => {
				const praktikum = PraktikumBuilder.fromSheet(sheet);
				const data = await this.fetchSheet(
					praktikum.sheetId,
					parseSheetIndex(sheet['gsx$namapraktikum']['$t'])
				).catch((err: Error) => {
					const message = `Could not access ${praktikum.name} Sheet ${err.message}`;
					throw new Error(message);
				});
				result.push(praktikum.addData(data));
			})
		);

		return result;
	}
}
