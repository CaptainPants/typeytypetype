import { expect, test } from '@jest/globals';
import { Types } from '../types/Types.js';
import { type TypeFromDefinition } from '../types.js';
import { StandardModelFactory } from './StandardModelFactory.js';

test('union', async () => {
    const a = Types.object({
        type: Types.prop(Types.constant('hasNumber')),
        number: Types.prop(Types.number()),
    });

    const b = Types.object({
        type: Types.prop(Types.constant('hasString')),
        string: Types.prop(Types.string()),
    });

    const c = Types.number();

    const type = Types.union(a, b, c);

    const value: TypeFromDefinition<typeof type> = {
        type: 'hasString',
        string: '$abc245',
    };

    const factory = new StandardModelFactory();

    const model = await factory.createModel({
        value,
        type,
    });

    const resolved = model.resolved;

    expect(resolved.archetype).toStrictEqual('object');

    expect(model.as(a)).toStrictEqual(null);
    expect(model.as(b)).not.toStrictEqual(null);
    expect(model.as(c)).toStrictEqual(null);
});
