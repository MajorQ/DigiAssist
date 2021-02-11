import { isNull, has } from 'lodash';
import { FetchError, ResponseBodyShapeError, ResponseParseError } from './classes/errors';

export async function fetchSheet(
	sheet_id: string,
	sheet_index: number
): Promise<Object[]> {
	const url = `https://spreadsheets.google.com/feeds/list/${sheet_id}/${sheet_index}/public/values?alt=json`;

	const response = await fetch(url).catch(() => {
		return Response.error();
	});

	if (!response.ok) {
		throw new FetchError(response.status);
	}

	const result = await response.json().catch(() => {
		return null;
	});


	if (isNull(result)) {
		throw ResponseParseError;
	}

	// first, check if response is has the proper headers
	if (!has(result, 'feed') || !has(result['feed'], 'entry')) {
		throw ResponseBodyShapeError;
	}

	// then, remove the sheet headers and only return the values inside the sheet
	return result['feed']['entry'];
}
