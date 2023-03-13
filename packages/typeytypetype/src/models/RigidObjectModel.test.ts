import { expect, test } from '@jest/globals';
import { Types } from '../types/Types.js';
import { type TypeFromDefinition } from '../types.js';
import { StandardModelFactory } from './StandardModelFactory.js';

test('rigid-object', async () => {
    const type = Types.object({
        num: Types.prop(Types.number()),
        str: Types.prop(Types.string()),
    });

    const value: TypeFromDefinition<typeof type> = {
        num: 1,
        str: 'banana',
    };

    const factory = new StandardModelFactory();

    const model = await factory.createModel({
        value,
        type,
    });

    const updated = await model.setPropertyValue('num', 2);

    expect(updated.value).toStrictEqual({ num: 2, str: 'banana' });
});
