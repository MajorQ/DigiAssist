import { Praktikum } from '../classes/praktikum';
import { Result } from '../classes/result';
import { convertColumnToLetter, getColumn, getURL } from '../utils';

// TODO: this may fail
// TODO: choose modul
export function searchPraktikan(
	inputNPM: string,
	praktikumList: Praktikum[],
	modul: string
): Result[] {
	let results: Result[] = [];
	praktikumList.forEach((praktikum) => {
		const data = praktikum.data;
		const index = data.findIndex(
			(praktikan) => praktikan['gsx$npm']['$t'] === inputNPM
		);
		if (index !== -1) {
			results.push({
				name: data[index]['gsx$nama']['$t'],
				prak_name: praktikum.name,
				url: getURL(
					praktikum.sheetID,
					praktikum.gid,
					convertColumnToLetter(
						getColumn(data[index]['content']['$t'], modul) + 1
					),
					index + 2
				),
			});
		}
	});
	return results;
}
