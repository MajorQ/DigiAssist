import { isEmpty } from 'lodash';
import { browser } from 'webextension-polyfill-ts';
import { CacheError } from '../classes/errors';
import {
	CacheADT,
	cacheFailure,
	cacheSuccess,
	cacheEmpty,
	PraktikumADT,
} from '../classes/praktikum';

export interface DataStore {
	fetch(): Promise<CacheADT>;
	store(data: PraktikumADT[]): void;
}

export class BrowserDataStore implements DataStore {
	async fetch(): Promise<CacheADT> {
		// NOTE: Using 2 keys at once doesn't work, so this will do
		const cachePromise = browser.storage.local.get('cache');
		const timePromise = browser.storage.local.get('time');
		return Promise.all([cachePromise, timePromise])
			.then(
				(
					values: [
						{
							cache: PraktikumADT[];
						},
						{
							time: number;
						}
					]
				) => {
					if (isEmpty(values[0] || isEmpty(values[1]))) {
						return cacheEmpty();
					}
					return cacheSuccess(values[0].cache, values[1].time);
				}
			)
			.catch(() => cacheFailure(new CacheError()));
	}

	async store(data: PraktikumADT[]) {
		return browser.storage.local.set({
			cache: data,
			time: Date.now(),
		});
	}
}
