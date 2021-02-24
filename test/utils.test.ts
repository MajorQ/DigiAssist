import { convertColumnToLetter } from '../src/utils';

describe('convertColumnToLetter', () => {
	it('should return correct value', () => {
		expect(convertColumnToLetter(8)).toEqual('I');
	});
});

