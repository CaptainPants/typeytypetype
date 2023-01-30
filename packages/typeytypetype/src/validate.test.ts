import { expect, test } from '@jest/globals';
import { Type } from './Type.js';
import { ResolutionContext } from './ResolutionContext.js';
import { createResolutionContext } from './createResolutionContext.js';

test('constant', () => {
    const resolutionContext = createResolutionContext();

    expect(Type.constant(1).validate(resolutionContext, 1)).toStrictEqual(true);
    expect(Type.constant(1).validate(resolutionContext, 2)).toStrictEqual(
        false
    );

    expect(
        Type.constant('yes').validate(resolutionContext, 'yes')
    ).toStrictEqual(true);
    expect(
        Type.constant('yes').validate(resolutionContext, 'no')
    ).toStrictEqual(false);

    expect(Type.constant(true).validate(resolutionContext, true)).toStrictEqual(
        true
    );
    expect(
        Type.constant(true).validate(resolutionContext, false)
    ).toStrictEqual(false);
    expect(
        Type.constant(false).validate(resolutionContext, false)
    ).toStrictEqual(true);

    expect(Type.null().validate(resolutionContext, null)).toStrictEqual(true);
    expect(Type.constant(1).validate(resolutionContext, null)).toStrictEqual(
        false
    );
});

test('string', () => {
    const definition = Type.string();

    const resolutionContext = createResolutionContext();

    expect(definition.validate(resolutionContext, 'test')).toStrictEqual(true);
    expect(definition.validate(resolutionContext, false)).toStrictEqual(false);
    expect(definition.validate(resolutionContext, 123)).toStrictEqual(false);
    expect(definition.validate(resolutionContext, {})).toStrictEqual(false);
});

test('number', () => {
    const definition = Type.number();

    const resolutionContext = createResolutionContext();

    expect(definition.validate(resolutionContext, 123)).toStrictEqual(true);

    expect(definition.validate(resolutionContext, 'test')).toStrictEqual(false);
    expect(definition.validate(resolutionContext, false)).toStrictEqual(false);
    expect(definition.validate(resolutionContext, {})).toStrictEqual(false);
});

test('boolean', () => {
    const definition = Type.boolean();

    const resolutionContext = createResolutionContext();

    expect(definition.validate(resolutionContext, false)).toStrictEqual(true);
    expect(definition.validate(resolutionContext, true)).toStrictEqual(true);

    expect(definition.validate(resolutionContext, 'test')).toStrictEqual(false);
    expect(definition.validate(resolutionContext, 123)).toStrictEqual(false);
    expect(definition.validate(resolutionContext, {})).toStrictEqual(false);
});

test('array', () => {
    const definition = Type.array(Type.number());

    const resolutionContext = createResolutionContext();

    expect(definition.validate(resolutionContext, [1, 2])).toStrictEqual(true);
    expect(definition.validate(resolutionContext, ['test', 2])).toStrictEqual(false);
    expect(definition.validate(resolutionContext, 1)).toStrictEqual(false);
});

test('object', () => {
    const definition = Type.object({
        id: Type.number(),
        name: Type.string(),
        roles: Type.array(Type.string()),
    });

    const resolutionContext = createResolutionContext();

    expect(
        definition.validate(resolutionContext, {
            id: 1,
            name: 'test',
            roles: ['Administrator'],
        })
    ).toStrictEqual(true);
    expect(definition.validate(resolutionContext, { id: 1 })).toStrictEqual(false);
    expect(definition.toTypeString()).toMatchSnapshot();
});

test('union', () => {
    const definition = Type.union(Type.constant(1), Type.constant(2), Type.null());

    const resolutionContext = createResolutionContext();

    expect(definition.validate(resolutionContext, 1)).toStrictEqual(true);
    expect(definition.validate(resolutionContext, 2)).toStrictEqual(true);
    expect(definition.validate(resolutionContext, null)).toStrictEqual(true);

    expect(definition.validate(resolutionContext, 3)).toStrictEqual(false);
});
