import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

import { fetchSheet } from '../src/functions';
import {
	FetchError,
	ResponseBodyShapeError,
	ResponseParseError,
} from '../src/classes/errors';
import * as mock_responses from './mock_responses';

describe('fetchSheet', () => {
	const test_response = [{ abc: '123' }, { def: '456' }];
	const test_sheet_id = 'test_id';
	const test_sheet_index = 1;
	const test_url = `https://spreadsheets.google.com/feeds/list/${test_sheet_id}/${test_sheet_index}/public/values?alt=json`;

	beforeEach(() => {
		global.fetch.resetMocks();
	});

	it('should call fetch', async () => {
		global.fetch.mockResponseOnce(JSON.stringify(mock_responses.success));
		await fetchSheet(test_sheet_id, test_sheet_index);
		expect(global.fetch).toHaveBeenCalledWith(test_url);
	});

	it('should return array of objects if fetch is successful', async () => {
		global.fetch.mockResponseOnce(JSON.stringify(mock_responses.success));
		expect(fetchSheet(test_sheet_id, test_sheet_index)).resolves.toEqual(
			test_response
		);
	});

	it('should throw an error if sheet is empty', async () => {
		global.fetch.mockResponseOnce(JSON.stringify(mock_responses.empty));
		expect(fetchSheet(test_sheet_id, test_sheet_index)).resolves.toThrow(
			ResponseBodyShapeError
		);
	});

	it('should throw an error if fetch has been rejected', async () => {
		global.fetch.mockRejectOnce();
		expect(fetchSheet(test_sheet_id, test_sheet_index)).resolves.toThrow(
			FetchError
		);
	});

	it('should throw an error if fetch has been aborted', async () => {
		global.fetch.mockAbortOnce();
		expect(fetchSheet(test_sheet_id, test_sheet_index)).resolves.toThrow(
			FetchError
		);
	});

	it("should throw an error if fetch can't be parsed", async () => {
		global.fetch.mockResponseOnce('this is not json');
		expect(fetchSheet(test_sheet_id, test_sheet_index)).resolves.toThrow(
			ResponseParseError
		);
	});
});
