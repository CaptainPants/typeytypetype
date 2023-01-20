import { expect, jest, test } from '@jest/globals';
import { Type } from './Type';
import { ResolutionContext } from './ResolutionContext';

test('string', () => {
    const model = Type.string();

    const resolutionContext: ResolutionContext = { getModelFromName:() => {throw new Error();} };

    expect(model.validate(resolutionContext, 'test')).toStrictEqual(true);
    expect(model.validate(resolutionContext, false)).toStrictEqual(false);
    expect(model.validate(resolutionContext, 123)).toStrictEqual(false);
    expect(model.validate(resolutionContext, {})).toStrictEqual(false);
});

test('number', () => {
    const model = Type.number();

    const resolutionContext: ResolutionContext = { getModelFromName:() => {throw new Error();} };

    expect(model.validate(resolutionContext, 123)).toStrictEqual(true);

    expect(model.validate(resolutionContext, 'test')).toStrictEqual(false);
    expect(model.validate(resolutionContext, false)).toStrictEqual(false);
    expect(model.validate(resolutionContext, {})).toStrictEqual(false);
});

test('boolean', () => {
    const model = Type.boolean();

    const resolutionContext: ResolutionContext = { getModelFromName:() => {throw new Error();} };

    expect(model.validate(resolutionContext, false)).toStrictEqual(true);
    expect(model.validate(resolutionContext, true)).toStrictEqual(true);

    expect(model.validate(resolutionContext, 'test')).toStrictEqual(false);
    expect(model.validate(resolutionContext, 123)).toStrictEqual(false);
    expect(model.validate(resolutionContext, {})).toStrictEqual(false);
});


