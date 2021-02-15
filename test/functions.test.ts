import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

import { GoogleSheetAPI as api} from '../src/sheets_api';
import * as mock_responses from './fixtures/responses';
import {
	FetchError,
	ResponseBodyShapeError,
	ResponseParseError,
} from '../src/classes/errors';

describe('fetchSheet', () => {
	const tResponse = [{ abc: '123' }, { def: '456' }];
	const tSheetId = 'test_id';
	const tSheetIndex = 1;
	const tURL = `https://spreadsheets.google.com/feeds/list/${tSheetId}/${tSheetIndex}/public/values?alt=json`;

	beforeEach(() => {
		global.fetch.resetMocks();
	});

	it('should call fetch', async () => {
		global.fetch.mockResponseOnce(JSON.stringify(mock_responses.success));
		await api.fetchSheet(tSheetId, tSheetIndex);
		expect(global.fetch).toHaveBeenCalledWith(tURL);
	});

	it('should return array of objects if fetch is successful', async () => {
		global.fetch.mockResponseOnce(JSON.stringify(mock_responses.success));
		const data = await api.fetchSheet(tSheetId, tSheetIndex);
		expect(data).toEqual(tResponse);
	});

	it('should throw a FetchError if fetch resulted in 404 error', async () => {
		global.fetch.mockResponseOnce(JSON.stringify(mock_responses.success), {
			status: 404,
		});
		const data = await api
			.fetchSheet(tSheetId, tSheetIndex)
			.catch((err: Error) => err);
		expect(data).toBeInstanceOf(FetchError);
	});

	it('should throw a FetchError if fetch has been aborted', async () => {
		global.fetch.mockAbortOnce();
		const data = await api
			.fetchSheet(tSheetId, tSheetIndex)
			.catch((err: Error) => err);
		expect(data).toBeInstanceOf(FetchError);
	});

	it('should throw a FetchError if fetch has been rejected', async () => {
		global.fetch.mockRejectOnce();
		const data = await api
			.fetchSheet(tSheetId, tSheetIndex)
			.catch((err: Error) => err);
		expect(data).toBeInstanceOf(FetchError);
	});

	it("should throw a ResponseParseError if fetch can't be parsed", async () => {
		global.fetch.mockResponseOnce('unparsable response');
		const data = await api
			.fetchSheet(tSheetId, tSheetIndex)
			.catch((err: Error) => err);
		expect(data).toBeInstanceOf(ResponseParseError);
	});

	it('should throw a ResponseBodyShapeError if sheet is empty', async () => {
		global.fetch.mockResponseOnce(JSON.stringify(mock_responses.empty));
		const data = await api
			.fetchSheet(tSheetId, tSheetIndex)
			.catch((err: Error) => err);
		expect(data).toBeInstanceOf(ResponseBodyShapeError);
	});
});

describe('fetch all sheets', () => {
	const tMasterSheet = 'test_sheet';
	const tResponse = [{ abc: '123' }, { def: '456' }];
	const tSheetId = 'test_id';
	const tSheetIndex = 1;

	it('should call fetch sheet', async () => {
		beforeEach(() => {
			jest.spyOn(api, 'fetchSheet').mockClear();
		});

		const mockFetchSheet = jest
			.spyOn(api, 'fetchSheet')
			.mockResolvedValue(tResponse);
		await api.fetchSheet(tSheetId, tSheetIndex);
		expect(mockFetchSheet).toBeCalled();
	});

	it('should return an array of praktikum if successful', async () => {});
});
