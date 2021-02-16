import { browser } from 'webextension-polyfill-ts';

export interface DataStore {
	fetch(): Promise<{ [s: string]: any }>;
	store(data: object[]): void;
}

export class BrowserDataStore implements DataStore {
	async fetch() {
		const data = await browser.storage.local.get(['cache, cacheTime']);
		return data;
	}

	async store(data: object[]) {
		await browser.storage.local.set({
			praktikum: data,
			time: Date.now(),
		});
	}
}
