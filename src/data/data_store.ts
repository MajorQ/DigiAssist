import { browser } from 'webextension-polyfill-ts';
import { Praktikum } from '../classes/praktikum';

export interface DataStore {
	fetch(): Promise<{ [s: string]: any }>;
	store(data: Praktikum[]): void;
}

export class BrowserDataStore implements DataStore {
	async fetch() {
		const data = await browser.storage.local.get(['cache, cacheTime']);
		return data;
	}

	async store(data: Praktikum[]) {
		await browser.storage.local.set({
			praktikum: data,
			time: Date.now(),
		});
	}
}
