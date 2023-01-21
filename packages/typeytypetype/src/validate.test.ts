import { expect, test } from '@jest/globals';
import { Type } from './Type.js';
import { ResolutionContext } from './ResolutionContext.js';

test('constant', () => {
    const resolutionContext: ResolutionContext = {
        getModelFromName: () => {
            throw new Error();
        },
    };

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
    const model = Type.string();

    const resolutionContext: ResolutionContext = {
        getModelFromName: () => {
            throw new Error();
        },
    };

    expect(model.validate(resolutionContext, 'test')).toStrictEqual(true);
    expect(model.validate(resolutionContext, false)).toStrictEqual(false);
    expect(model.validate(resolutionContext, 123)).toStrictEqual(false);
    expect(model.validate(resolutionContext, {})).toStrictEqual(false);
});

test('number', () => {
    const model = Type.number();

    const resolutionContext: ResolutionContext = {
        getModelFromName: () => {
            throw new Error();
        },
    };

    expect(model.validate(resolutionContext, 123)).toStrictEqual(true);

    expect(model.validate(resolutionContext, 'test')).toStrictEqual(false);
    expect(model.validate(resolutionContext, false)).toStrictEqual(false);
    expect(model.validate(resolutionContext, {})).toStrictEqual(false);
});

test('boolean', () => {
    const model = Type.boolean();

    const resolutionContext: ResolutionContext = {
        getModelFromName: () => {
            throw new Error();
        },
    };

    expect(model.validate(resolutionContext, false)).toStrictEqual(true);
    expect(model.validate(resolutionContext, true)).toStrictEqual(true);

    expect(model.validate(resolutionContext, 'test')).toStrictEqual(false);
    expect(model.validate(resolutionContext, 123)).toStrictEqual(false);
    expect(model.validate(resolutionContext, {})).toStrictEqual(false);
});

test('array', () => {
    const model = Type.array(Type.number());

    const resolutionContext: ResolutionContext = {
        getModelFromName: () => {
            throw new Error();
        },
    };

    expect(model.validate(resolutionContext, [1, 2])).toStrictEqual(true);
    expect(model.validate(resolutionContext, ['test', 2])).toStrictEqual(false);
    expect(model.validate(resolutionContext, 1)).toStrictEqual(false);
});

test('object', () => {
    const model = Type.object({
        id: Type.number(),
        name: Type.string(),
        roles: Type.array(Type.string()),
    });

    const resolutionContext: ResolutionContext = {
        getModelFromName: () => {
            throw new Error();
        },
    };

    expect(
        model.validate(resolutionContext, {
            id: 1,
            name: 'test',
            roles: ['Administrator'],
        })
    ).toStrictEqual(true);
    expect(model.validate(resolutionContext, { id: 1 })).toStrictEqual(false);
    expect(model.toTypeString()).toMatchSnapshot();
});

test('union', () => {
    const model = Type.union(Type.constant(1), Type.constant(2), Type.null());

    const resolutionContext: ResolutionContext = {
        getModelFromName: () => {
            throw new Error();
        },
    };

    expect(model.validate(resolutionContext, 1)).toStrictEqual(true);
    expect(model.validate(resolutionContext, 2)).toStrictEqual(true);
    expect(model.validate(resolutionContext, null)).toStrictEqual(true);

    expect(model.validate(resolutionContext, 3)).toStrictEqual(false);
});
