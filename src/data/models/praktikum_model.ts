import { Praktikum } from '../../classes/praktikum';

export class PraktikumModel extends Praktikum {
	static fromSheet(sheet: object) {
		return new Praktikum(
			sheet['gsx$namapraktikum']['$t'],
			sheet['gsx$sheetid']['$t'],
			sheet['gsx$gid']['$t']
		);
	}
	
	static fromCache() {
		
	}
}
