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
