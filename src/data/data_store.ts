import { isEmpty } from 'lodash';
import { browser } from 'webextension-polyfill-ts';
import { CacheError } from '../classes/errors';
import {
	Praktikum,
	CachePraktikum,
	cacheFailure,
	cacheSuccess,
	cacheEmpty,
} from '../classes/praktikum';

export interface DataStore {
	fetch(): Promise<CachePraktikum>;
	store(data: Praktikum[]): void;
}

//TODO: for some reason using 2 keys at once doesn't work
export class BrowserDataStore implements DataStore {
	async fetch(): Promise<CachePraktikum> {
		const cachePromise = browser.storage.local.get('cache');
		const timePromise = browser.storage.local.get('time');
		return Promise.all([cachePromise, timePromise])
			.then(
				(
					values: [
						{
							cache: Praktikum[];
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

	async store(data: Praktikum[]) {
		return browser.storage.local.set({
			cache: data,
			time: Date.now(),
		});
	}
}
