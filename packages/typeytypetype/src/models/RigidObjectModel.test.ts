import { expect, test } from '@jest/globals';
import { Type } from '../definitions/Type.js';
import { type TypeFromDefinition } from '../types.js';
import { StandardModelFactory } from './StandardModelFactory.js';

test('rigid-object', async () => {
    const definition = Type.object({
        num: Type.number(),
        str: Type.string(),
    });

    const value: TypeFromDefinition<typeof definition> = {
        num: 1,
        str: 'banana',
    };

    const factory = new StandardModelFactory();

    const model = await factory.createModel({
        value,
        definition,
    });

    const updated = await model.setPropertyValue('num', 2);

    expect(updated.value).toStrictEqual({ num: 2, str: 'banana' });
});
