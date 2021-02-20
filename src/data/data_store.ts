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

export class BrowserDataStore implements DataStore {
	async fetch(): Promise<CachePraktikum> {
		return await browser.storage.local
			.get(['praktikum, time'])
			.then((data: {praktikum: Praktikum[], time: number}) =>
				isEmpty(data) ? cacheEmpty() : cacheSuccess(data.praktikum, data.time)
			)
			.catch(() => cacheFailure(new CacheError()));
	}

	async store(data: Praktikum[]) {
		return browser.storage.local.set({
			praktikum: data,
			time: Date.now(),
		});
	}
}
