import { browser } from 'webextension-polyfill-ts';
import { Praktikum } from '../classes/praktikum';

export interface DataStore {
	fetch(): Promise<{ praktikum: Praktikum[]; time: number }>;
	store(data: Praktikum[]): void;
}

// TODO: this function may fail, should return either 
export class BrowserDataStore implements DataStore {
	async fetch(): Promise<{ praktikum: Praktikum[]; time: number }> {
		const data = await browser.storage.local.get(['cache, cacheTime']);
		return { praktikum: data.praktikum, time: data.time };
	}

	async store(data: Praktikum[]) {
		return browser.storage.local.set({
			praktikum: data,
			time: Date.now(),
		});
	}
}
