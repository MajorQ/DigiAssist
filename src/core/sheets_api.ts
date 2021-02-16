import { Praktikum } from "../classes/praktikum";

export interface SheetsAPI {
	fetchSheet(sheet_id: string, sheet_index: number): Promise<object[]>;
	fetchSheetsFrom(masterSheetId: string): Promise<Praktikum[]>;
}
