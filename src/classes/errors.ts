import { CustomError } from 'ts-custom-error'

export class FetchError extends CustomError {
	constructor(status?: number) {
		super(`(fetch error with code ${status})`);
	}
}

export class ResponseParseError extends CustomError {
	constructor() {
		super('(parse error)');
	}
}

export class ResponseBodyShapeError extends CustomError {
	constructor() {
		super('(object shape error)');
	}
}