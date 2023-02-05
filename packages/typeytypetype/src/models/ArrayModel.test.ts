import { expect, test } from '@jest/globals';
import { Type } from '../Type.js';
import { StandardModelFactory } from './StandardModelFactory.js';

test('array', async () => {
    const definition = Type.array(Type.number());

    const factory = new StandardModelFactory();

    const input = [1, 2, 3];

    const model = factory.create({
        value: input,
        definition,
        depth: StandardModelFactory.defaultMaxDepth,
    });

    const result = await model.spliceElements(1, 0, [6, 7]);

    expect(input).toStrictEqual([1, 2, 3]);
    expect(result.value).toStrictEqual([1, 6, 7, 2, 3]);
});
