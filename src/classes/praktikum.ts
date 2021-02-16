export class Praktikum {
	private readonly _data: object;
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