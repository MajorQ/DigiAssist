import { Either } from "../lib/either";

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

export type Praktikum = Either<PraktikumFailure, PraktikumSuccess>;