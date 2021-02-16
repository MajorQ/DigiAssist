import { DataStore } from "../../src/data/data_store";
import { SheetsAPI } from "../../src/data/sheets_api";

export class MockSheetsAPI implements SheetsAPI {
    async fetchSheet(sheet_id: string, sheet_index: number) : Promise<object[]> {
        return [{}];
    }
}

export class MockDataStore implements DataStore {
    async fetch(): Promise<{ [s: string]: any }> {
        return [{}];
    }
	store(data: object[]): void {}
}