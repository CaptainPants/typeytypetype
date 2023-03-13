import { expect, test } from '@jest/globals';
import { Types } from '../types/Types.js';

test('test', async () => {
    const num = Types.number().withValidator(function* (value) {
        if (value < 3) {
            yield 'Value must be greater than or equal to 3';
        }
        if (value > 8) {
            yield 'Value must be less than or equal to 8';
        }
    });

    expect(await num.validate(1)).toStrictEqual([
        { message: 'Value must be greater than or equal to 3' },
    ]);
    expect(await num.validate(5)).toStrictEqual([]);
    expect(await num.validate(10)).toStrictEqual([
        { message: 'Value must be less than or equal to 8' },
    ]);
});
