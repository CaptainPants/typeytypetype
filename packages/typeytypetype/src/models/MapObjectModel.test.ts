import { expect, test } from '@jest/globals';
import { Type } from '../definitions/Type.js';
import { type TypeFromDefinition } from '../types.js';
import { createModel } from './createModel.js';

test('map-object', async () => {
    const definition = Type.map(Type.number());

    const value: TypeFromDefinition<typeof definition> = {
        a: 1,
        b: 2,
    };

    const model = await createModel(value, definition);

    const updated = await model.setPropertyValue('c', 3);

    expect(updated.value).toStrictEqual({ a: 1, b: 2, c: 3 });
});
