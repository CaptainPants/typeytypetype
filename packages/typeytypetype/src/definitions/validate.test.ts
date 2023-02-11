import { expect, test } from '@jest/globals';
import { Type } from './Type.js';

test('constant', () => {
    expect(Type.constant(1).matchesStructure(1)).toStrictEqual(true);
    expect(Type.constant(1).matchesStructure(2)).toStrictEqual(false);

    expect(Type.constant('yes').matchesStructure('yes')).toStrictEqual(true);
    expect(Type.constant('yes').matchesStructure('no')).toStrictEqual(false);

    expect(Type.constant(true).matchesStructure(true)).toStrictEqual(true);
    expect(Type.constant(true).matchesStructure(false)).toStrictEqual(false);
    expect(Type.constant(false).matchesStructure(false)).toStrictEqual(true);

    expect(Type.null().matchesStructure(null)).toStrictEqual(true);
    expect(Type.constant(1).matchesStructure(null)).toStrictEqual(false);
});

test('string', () => {
    const definition = Type.string();

    expect(definition.matchesStructure('test')).toStrictEqual(true);
    expect(definition.matchesStructure(false)).toStrictEqual(false);
    expect(definition.matchesStructure(123)).toStrictEqual(false);
    expect(definition.matchesStructure({})).toStrictEqual(false);
});

test('number', () => {
    const definition = Type.number();

    expect(definition.matchesStructure(123)).toStrictEqual(true);

    expect(definition.matchesStructure('test')).toStrictEqual(false);
    expect(definition.matchesStructure(false)).toStrictEqual(false);
    expect(definition.matchesStructure({})).toStrictEqual(false);
});

test('boolean', () => {
    const definition = Type.boolean();

    expect(definition.matchesStructure(false)).toStrictEqual(true);
    expect(definition.matchesStructure(true)).toStrictEqual(true);

    expect(definition.matchesStructure('test')).toStrictEqual(false);
    expect(definition.matchesStructure(123)).toStrictEqual(false);
    expect(definition.matchesStructure({})).toStrictEqual(false);
});

test('array', () => {
    const definition = Type.array(Type.number());

    expect(definition.matchesStructure([1, 2])).toStrictEqual(true);
    expect(definition.matchesStructure(['test', 2])).toStrictEqual(false);
    expect(definition.matchesStructure(1)).toStrictEqual(false);
});

test('object', () => {
    const definition = Type.object({
        id: Type.number(),
        name: Type.string(),
        roles: Type.array(Type.string()),
    });

    expect(
        definition.matchesStructure({
            id: 1,
            name: 'test',
            roles: ['Administrator'],
        })
    ).toStrictEqual(true);
    expect(definition.matchesStructure({ id: 1 })).toStrictEqual(false);
    expect(definition.toTypeString()).toMatchSnapshot();
});

test('union', () => {
    const definition = Type.union(
        Type.constant(1),
        Type.constant(2),
        Type.null()
    );

    expect(definition.matchesStructure(1)).toStrictEqual(true);
    expect(definition.matchesStructure(2)).toStrictEqual(true);
    expect(definition.matchesStructure(null)).toStrictEqual(true);

    expect(definition.matchesStructure(3)).toStrictEqual(false);
});
