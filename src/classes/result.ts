import { convertColumnToLetter } from "../utils";
import { Praktikum } from "./praktikum";

export class Result {
	private readonly row: number;
	private readonly column: string;

	constructor(
		public readonly name: string,
		public readonly praktikum: Praktikum,
		row: number,
		column: number
	) {
		this.row = row + 2;
		this.column = convertColumnToLetter(column);
	}

	get url() {
		return `https://docs.google.com/spreadsheets/d/${this.praktikum.sheetId}/edit#gid=${this.praktikum.gid}&range=${this.column}${this.row}`;
	}
}
