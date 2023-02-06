import { expect, test } from '@jest/globals';
import { Type } from '../definitions/Type.js';
import { TypeFromDefinition } from '../types.js';
import { StandardModelFactory } from './StandardModelFactory.js';

test('map-object', async () => {
    const definition = Type.map(Type.number());

    const value: TypeFromDefinition<typeof definition> = {
        a: 1,
        b: 2,
    };

    const factory = new StandardModelFactory();

    const model = factory.create({
        value,
        definition,
        depth: StandardModelFactory.defaultMaxDepth,
    });

    const updated = await model.setPropertyValue('c', 3);

    expect(updated.value).toStrictEqual({ a: 1, b: 2, c: 3 });
});
