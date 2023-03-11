import { expect, test } from '@jest/globals';
import { Type } from '../definitions/Type.js';
import { type TypeFromDefinition } from '../types.js';
import { StandardModelFactory } from './StandardModelFactory.js';

test('union', async () => {
    const a = Type.object({
        type: Type.prop(Type.constant('hasNumber')),
        number: Type.prop(Type.number()),
    });

    const b = Type.object({
        type: Type.prop(Type.constant('hasString')),
        string: Type.prop(Type.string()),
    });

    const c = Type.number();

    const definition = Type.union(a, b, c);

    const value: TypeFromDefinition<typeof definition> = {
        type: 'hasString',
        string: '$abc245',
    };

    const factory = new StandardModelFactory();

    const model = await factory.createModel({
        value,
        definition,
    });

    const resolved = model.resolved;

    expect(resolved.type).toStrictEqual('object');

    expect(model.as(a)).toStrictEqual(null);
    expect(model.as(b)).not.toStrictEqual(null);
    expect(model.as(c)).toStrictEqual(null);
});
