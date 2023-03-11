import { expect, test } from '@jest/globals';
import { Type } from './Type.js';

test('constant', () => {
    expect(Type.constant(1).matches(1)).toStrictEqual(true);
    expect(Type.constant(1).matches(2)).toStrictEqual(false);

    expect(Type.constant('yes').matches('yes')).toStrictEqual(true);
    expect(Type.constant('yes').matches('no')).toStrictEqual(false);

    expect(Type.constant(true).matches(true)).toStrictEqual(true);
    expect(Type.constant(true).matches(false)).toStrictEqual(false);
    expect(Type.constant(false).matches(false)).toStrictEqual(true);

    expect(Type.null().matches(null)).toStrictEqual(true);
    expect(Type.constant(1).matches(null)).toStrictEqual(false);
});

test('string', () => {
    const definition = Type.string();

    expect(definition.matches('test')).toStrictEqual(true);
    expect(definition.matches(false)).toStrictEqual(false);
    expect(definition.matches(123)).toStrictEqual(false);
    expect(definition.matches({})).toStrictEqual(false);
});

test('number', () => {
    const definition = Type.number();

    expect(definition.matches(123)).toStrictEqual(true);

    expect(definition.matches('test')).toStrictEqual(false);
    expect(definition.matches(false)).toStrictEqual(false);
    expect(definition.matches({})).toStrictEqual(false);
});

test('boolean', () => {
    const definition = Type.boolean();

    expect(definition.matches(false)).toStrictEqual(true);
    expect(definition.matches(true)).toStrictEqual(true);

    expect(definition.matches('test')).toStrictEqual(false);
    expect(definition.matches(123)).toStrictEqual(false);
    expect(definition.matches({})).toStrictEqual(false);
});

test('array', () => {
    const definition = Type.array(Type.number());

    expect(definition.matches([1, 2])).toStrictEqual(true);
    expect(definition.matches(['test', 2])).toStrictEqual(false);
    expect(definition.matches(1)).toStrictEqual(false);
});

test('object', () => {
    const definition = Type.object({
        id: Type.property(Type.number()),
        name: Type.property(Type.string()),
        roles: Type.property(Type.array(Type.string())),
    });

    expect(
        definition.matches({
            id: 1,
            name: 'test',
            roles: ['Administrator'],
        })
    ).toStrictEqual(true);
    expect(definition.matches({ id: 1 })).toStrictEqual(false);
    expect(definition.toTypeString()).toMatchSnapshot();
});

test('union', () => {
    const definition = Type.union(
        Type.constant(1),
        Type.constant(2),
        Type.null()
    );

    expect(definition.matches(1)).toStrictEqual(true);
    expect(definition.matches(2)).toStrictEqual(true);
    expect(definition.matches(null)).toStrictEqual(true);

    expect(definition.matches(3)).toStrictEqual(false);
});
