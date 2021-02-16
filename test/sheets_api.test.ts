import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

import { FetchSheetsAPI } from '../src/fetch_sheets_api';
const mockAPI = new FetchSheetsAPI();
import * as mockResponses from './fixtures/responses';
import {
	FetchError,
	ResponseBodyShapeError,
	ResponseParseError,
} from '../src/classes/errors';
import { PraktikumBuilder } from '../src/classes/praktikum';

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
	});

	it('should throw a ResponseBodyShapeError if sheet is empty', async () => {
		global.fetch.mockResponseOnce(mockResponses.empty);
		const data = await mockAPI
			.fetchSheet(tSheetId, tSheetIndex)
			.catch((err: Error) => err);
		expect(data).toBeInstanceOf(ResponseBodyShapeError);
	});
});

describe('fetchSheetsFrom', () => {
	const tMasterSheet = 'test_sheet';
	const tFetchResult = JSON.parse(mockResponses.success).feed.entry;
	const tData = [{}];
	const mockFetchSheet = jest.spyOn(mockAPI, 'fetchSheet');

	beforeEach(() => {
		mockFetchSheet.mockClear();
	});

	it('should call fetch sheet', async () => {
		mockFetchSheet.mockResolvedValue(tFetchResult);
		await mockAPI.fetchSheetsFrom(tMasterSheet);
		expect(mockFetchSheet).toBeCalledWith(tMasterSheet, 1);
	});

	it('should return an array of praktikum if successful', async () => {
		mockFetchSheet.mockResolvedValue(tData)
		mockFetchSheet.mockResolvedValueOnce(tFetchResult);
		const data = await mockAPI.fetchSheetsFrom(tMasterSheet);
		const tPraktikumResult = tFetchResult.map((tResult: object) => {
			const tmp = PraktikumBuilder.fromSheet(tResult);
			return tmp.addData(tData);
		});
		expect(data).toStrictEqual(tPraktikumResult);
	});
});
