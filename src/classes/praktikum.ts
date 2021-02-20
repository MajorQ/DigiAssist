import { ADT } from 'ts-adt';

export interface PraktikumSuccess {
	name: string;
	sheetID: string;
	gid: string;
	data: object[];
}

export interface PraktikumFailure {
	name: string;
	error: Error;
}

export type Praktikum = ADT<{
	failure: { value: PraktikumFailure };
	success: { value: PraktikumSuccess };
}>;

export function praktikumSuccess(
	name: string,
	sheetID: string,
	gid: string,
	data: object[]
): Praktikum {
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

export function praktikumFailure(name: string, error: Error): Praktikum {
	return {
		_type: 'failure',
		value: {
			name,
			error,
		},
	};
}

export type PraktikumList = ADT<{
	empty: {};
	failure: { value: Error };
	success: { value: Praktikum[] };
}>;

export function praktikumListFailure(error: Error): PraktikumList {
	return {
		_type: 'failure',
		value: error,
	};
}

export function praktikumListSuccess(
	praktikumList: Praktikum[]
): PraktikumList {
	return {
		_type: 'success',
		value: praktikumList,
	};
}

export function praktikumListEmpty(): PraktikumList {
	return {
		_type: 'empty',
	};
}

export type CachePraktikum = ADT<{
	empty: {};
	failure: { value: Error };
	success: { value: { praktikumList: Praktikum[]; time: number } };
}>;

export function cacheFailure(error: Error): CachePraktikum {
	return {
		_type: 'failure',
		value: error,
	};
}

export function cacheSuccess(
	praktikumList: Praktikum[],
	time: number
): CachePraktikum {
	return {
		_type: 'success',
		value: {praktikumList, time},
	};
}

export function cacheEmpty(): CachePraktikum {
	return {
		_type: 'empty',
	};
}
