import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

import { FetchSheetsAPI } from '../../src/data/sheets_api';
const mockAPI = new FetchSheetsAPI();

import * as mockResponses from '../fixtures/responses';
import {
	FetchError,
	ResponseBodyShapeError,
	ResponseParseError,
} from '../../src/classes/errors';

describe('fetchSheet', () => {
	const tSheetId = 'test_id';
	const tSheetIndex = 1;
	const tURL = `https://spreadsheets.google.com/feeds/list/${tSheetId}/${tSheetIndex}/public/values?alt=json`;
	const tResult = JSON.parse(mockResponses.success).feed.entry;

	beforeEach(() => {
		global.fetch.resetMocks();
	});

	it('should call fetch', async () => {
		global.fetch.mockResponseOnce(mockResponses.success);
		await mockAPI.fetchSheet(tSheetId, tSheetIndex);
		expect(global.fetch).toBeCalledWith(tURL);
	});

	it('should return array of objects if fetch is successful', async () => {
		global.fetch.mockResponseOnce(mockResponses.success);
		const data = await mockAPI.fetchSheet(tSheetId, tSheetIndex);
		expect(data).toStrictEqual(tResult);
	});

	it('should throw a FetchError if fetch resulted in 404 error', async () => {
		global.fetch.mockResponseOnce(mockResponses.success, {
			status: 404,
		});
		const data = await mockAPI
			.fetchSheet(tSheetId, tSheetIndex)
			.catch((err: Error) => err);
		expect(data).toBeInstanceOf(FetchError);
	});

	it('should throw a FetchError if fetch has been aborted', async () => {
		global.fetch.mockAbortOnce();
		const data = await mockAPI
			.fetchSheet(tSheetId, tSheetIndex)
			.catch((err: Error) => err);
		expect(data).toBeInstanceOf(FetchError);
	});

	it('should throw a FetchError if fetch has been rejected', async () => {
		global.fetch.mockRejectOnce();
		const data = await mockAPI
			.fetchSheet(tSheetId, tSheetIndex)
			.catch((err: Error) => err);
		expect(data).toBeInstanceOf(FetchError);
	});

	it("should throw a ResponseParseError if fetch can't be parsed", async () => {
		global.fetch.mockResponseOnce('unparsable response');
		const data = await mockAPI
			.fetchSheet(tSheetId, tSheetIndex)
			.catch((err: Error) => err);
		expect(data).toBeInstanceOf(ResponseParseError);
		// just to make sure this actually works properly
		expect(data).not.toBeInstanceOf(FetchError); 
	});

	it('should throw a ResponseBodyShapeError if sheet is empty', async () => {
		global.fetch.mockResponseOnce(mockResponses.empty);
		const data = await mockAPI
			.fetchSheet(tSheetId, tSheetIndex)
			.catch((err: Error) => err);
		expect(data).toBeInstanceOf(ResponseBodyShapeError);
	});
});

