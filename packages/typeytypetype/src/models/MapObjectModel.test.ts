import { expect, test } from '@jest/globals';
import { Types } from '../types/Types.js';
import { type TypeFromDefinition } from '../types.js';
import { createModel } from './createModel.js';

test('map-object', async () => {
    const type = Types.map(Types.number());

    const value: TypeFromDefinition<typeof type> = {
        a: 1,
        b: 2,
    };

    const model = await createModel(value, type);

    const updated = await model.setPropertyValue('c', 3);

    expect(updated.value).toStrictEqual({ a: 1, b: 2, c: 3 });
});
