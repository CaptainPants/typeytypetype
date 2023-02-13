import { expect, test } from '@jest/globals';
import { and, or } from './logical.js';

test('or', async () => {
    expect(or([false, false, true], (item) => item)).toStrictEqual(true);
    expect(or([false, false, false], (item) => item)).toStrictEqual(false);
    expect(or([false, true, false], (item) => item)).toStrictEqual(true);
    expect(or([false, false, false], (item) => item)).toStrictEqual(false);
    expect(or([], (item) => item)).toStrictEqual(false);
});

test('and', async () => {
    expect(and([true, true, true], (item) => item)).toStrictEqual(true);
    expect(and([false, true, true], (item) => item)).toStrictEqual(false);
    expect(and([true, true], (item) => item)).toStrictEqual(true);
    expect(and([false, false], (item) => item)).toStrictEqual(false);
    expect(and([], (item) => item)).toStrictEqual(true);
});
