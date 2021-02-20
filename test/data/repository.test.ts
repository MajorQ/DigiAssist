import * as mockResponses from '../fixtures/responses';
import { PraktikumModel } from '../../src/data/models/praktikum_model';
import { FetchError } from '../../src/classes/errors';

import { Repository } from '../../src/data/repository';
import { MockDataStore, MockSheetsAPI } from './mocks';

const mockAPI = new MockSheetsAPI();
const mockDataStore = new MockDataStore();
const mockRepository = new Repository(mockDataStore, mockAPI, 'test_sheet');

describe('fetchSheetsFrom', () => {
	const tMasterSheet = 'test_sheet';
	const tFetchResult = JSON.parse(mockResponses.success).feed.entry;
	const tData = [{}];
	const mockFetchSheet = jest.spyOn(mockAPI, 'fetchSheet');

	async function fetchSheetsFromPublic() {
		return await mockRepository
			// @ts-ignore
			.fetchSheetsFrom(tMasterSheet)
			.catch((err: Error) => {
				return err;
			});
	}

	beforeEach(() => {
		mockFetchSheet.mockClear();
	});

	it('should call fetch sheet', async () => {
		mockFetchSheet.mockResolvedValue(tFetchResult);
		await fetchSheetsFromPublic();
		expect(mockFetchSheet).toBeCalledWith(tMasterSheet, 1);
	});

	it('should return an array of praktikum if successful', async () => {
		mockFetchSheet.mockResolvedValueOnce(tFetchResult); //  mock fetch from Master Shet
		mockFetchSheet.mockResolvedValue(tData); // mock for other sheets
		const data = await fetchSheetsFromPublic();
		const tPraktikumResult = tFetchResult.map((tResult: object) => {
			const tmp = PraktikumModel.fromSheet(tResult);
			return tmp.addData(tData);
		});
		expect(data).toStrictEqual(tPraktikumResult);
	});

	it('should forward error from fetchSheet if MasterSheet fails', async () => {
		mockFetchSheet.mockRejectedValueOnce(new FetchError(0));
		const data = await fetchSheetsFromPublic();
		expect(data).toBeInstanceOf(FetchError);
	});

	it('should not stop even after one sheet (aside from MasterSheet) has an error', async () => {
		mockFetchSheet.mockResolvedValue(tData);
		mockFetchSheet.mockResolvedValueOnce(tFetchResult);
		mockFetchSheet.mockRejectedValueOnce(new FetchError());
		const data = await fetchSheetsFromPublic();
		const tPraktikumResult = tFetchResult.map((tResult: object) => {
			const tmp = PraktikumModel.fromSheet(tResult);
			return tmp.addData(tData);
		});
		expect(data).toStrictEqual(tPraktikumResult);
		expect(data).not.toThrowError;
	});
});
