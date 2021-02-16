export class Praktikum {
	private readonly _data: object
	constructor(
		public readonly name: string,
		public readonly sheetId: string,
		public readonly gid: string,
		data?: object
	) {
		this._data = data;
	}

	get data() {
		return this._data;
	}

	addData(data: object[]) {
		return new Praktikum(this.name, this.sheetId, this.gid, data);
	}
}

export class PraktikumBuilder extends Praktikum {
	public readonly sheetIndex: number;
	static fromSheet(sheet: object) {	
		return new Praktikum(
			sheet['gsx$namapraktikum']['$t'],
			sheet['gsx$sheetid']['$t'],
			sheet['gsx$gid']['$t']
		);
	}	
}
