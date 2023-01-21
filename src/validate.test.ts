import { expect, test } from '@jest/globals';
import { Type } from './Type';
import { ResolutionContext } from './ResolutionContext';

test('constant', () => {
    const resolutionContext: ResolutionContext = {
        getModelFromName: () => {
            throw new Error();
        },
    };

    expect(Type.value(1).validate(resolutionContext, 1)).toStrictEqual(true);
    expect(Type.value(1).validate(resolutionContext, 2)).toStrictEqual(false);

    expect(Type.value('yes').validate(resolutionContext, 'yes')).toStrictEqual(
        true
    );
    expect(Type.value('yes').validate(resolutionContext, 'no')).toStrictEqual(
        false
    );

    expect(Type.value(true).validate(resolutionContext, true)).toStrictEqual(
        true
    );
    expect(Type.value(true).validate(resolutionContext, false)).toStrictEqual(
        false
    );
    expect(Type.value(false).validate(resolutionContext, false)).toStrictEqual(
        true
    );

    expect(Type.value(null).validate(resolutionContext, null)).toStrictEqual(
        true
    );
    expect(Type.value(1).validate(resolutionContext, null)).toStrictEqual(
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
        roles: Type.array(Type.string())
    });

    const resolutionContext: ResolutionContext = {
        getModelFromName: () => {
            throw new Error();
        },
    };

    expect(
        model.validate(resolutionContext, { id: 1, name: 'test', roles: ["Administrator"] })
    ).toStrictEqual(true);
    expect(model.validate(resolutionContext, { id: 1 })).toStrictEqual(false);
    expect(model.toTypeString()).toMatchSnapshot();
});

test('union', () => {
    const model = Type.union(Type.value(1), Type.value(2), Type.value(null));

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
