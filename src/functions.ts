import { has } from 'lodash';
import {
	FetchError,
	ResponseBodyShapeError,
	ResponseParseError,
} from './classes/errors';

export async function fetchSheet(
	sheet_id: string,
	sheet_index: number
): Promise<Object[]> {
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

export async function fetchAllSheets(masterSheetId: string) {
	const data = await fetchSheet(masterSheetId, 1).catch((err: Error) => {
		throw `Could not access Master Sheet ${err.message}`;
	});

	console.log(data);
}
