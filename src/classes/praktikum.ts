import { ADT } from 'ts-adt';

export interface Praktikum {
	name: string;
	sheetID: string;
	gid: string;
	data: object[];
}

export interface PraktikumFailure {
	name: string;
	error: Error;
}

export type PraktikumADT = ADT<{
	failure: { value: PraktikumFailure };
	success: { value: Praktikum };
}>;

export function praktikumSuccess(
	name: string,
	sheetID: string,
	gid: string,
	data: object[]
): PraktikumADT {
	return {
		_type: 'success',
		value: {
			name,
			sheetID,
			gid,
			data,
		},
	};
}

export function praktikumFailure(name: string, error: Error): PraktikumADT {
	return {
		_type: 'failure',
		value: {
			name,
			error,
		},
	};
}

export type PraktikumListADT = ADT<{
	failure: { value: Error };
	success: { value: PraktikumADT[] };
}>;

export function praktikumListFailure(error: Error): PraktikumListADT {
	return {
		_type: 'failure',
		value: error,
	};
}

export function praktikumListSuccess(
	praktikumList: PraktikumADT[]
): PraktikumListADT {
	return {
		_type: 'success',
		value: praktikumList,
	};
}

export type CachePraktikum = ADT<{
	empty: {};
	failure: { value: Error };
	success: { value: { praktikumList: PraktikumADT[]; time: number } };
}>;

export function cacheFailure(error: Error): CachePraktikum {
	return {
		_type: 'failure',
		value: error,
	};
}

export function cacheSuccess(
	praktikumList: PraktikumADT[],
	time: number
): CachePraktikum {
	return {
		_type: 'success',
		value: { praktikumList, time },
	};
}

export function cacheEmpty(): CachePraktikum {
	return {
		_type: 'empty',
	};
}
