export class FetchError extends Error {
	constructor(status?: number) {
		super(`(fetch error ${status})`);
	}
}

export class ResponseParseError extends Error {
	constructor() {
		super('(parse error)');
	}
}

export class ResponseBodyShapeError extends Error {
	constructor() {
		super('(object shape error)');
	}
}
