import { expect, test } from '@jest/globals';
import { Type } from '../Type.js';
import { StandardModelFactory } from './StandardModelFactory.js';

test('array', async () => {
    const definition = Type.array(Type.number());

    const factory = new StandardModelFactory();

    let resultMatch: number[] | undefined;

    const replace = async (newValue: number[]): Promise<void> => {
        resultMatch = newValue;
    }

    const input = [1, 2, 3];

    const model = factory.create({ value: input, definition, replace, depth: StandardModelFactory.defaultMaxDepth });

    await model.spliceElements(1, 0, [6, 7]);

    expect(input).toStrictEqual([1, 2, 3]);
    expect(resultMatch).toStrictEqual([1, 6, 7, 2, 3]);
});
