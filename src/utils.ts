import { Result } from './classes/result';

export function parseSheetIndex(sheetIndex: string): number {
	return sheetIndex === '' ? 2 : parseInt(sheetIndex);
}

// https://stackoverflow.com/questions/21229180/convert-column-index-into-corresponding-column-letter
export function convertColumnToLetter(number: number): string {
	const base = Math.floor(number / 26);
	const result =
		base >= 0
			? convertColumnToLetter(base - 1) +
			  String.fromCharCode(65 + (number % 26))
			: '';
	return result;
}

export function getColumn(content: string, modul: string): number {
	const sliceIndex = content.indexOf(modul);
	const sliced = content.slice(0, sliceIndex);
	return (sliced.match(/: /g) || []).length;
}

export function getURL(res: Result): string {
	return `https://docs.google.com/spreadsheets/d/${res.praktikum.sheetID}/edit#gid=${res.praktikum.gid}&range=${res.column}${res.row}`;
}
