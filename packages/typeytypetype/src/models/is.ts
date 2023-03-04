import {
    ArrayDefinition,
    BooleanConstantDefinition,
    BooleanDefinition,
    NumberConstantDefinition,
    NumberDefinition,
    RigidObjectDefinition,
    StringConstantDefinition,
    StringDefinition,
} from '../definitions';
import { type Model, type UnknownModel } from './Model.js';

export function isModel<T>(value: T | Model<T>): value is Model<T>;
export function isModel(value: unknown): value is Model<unknown> {
    return (
        typeof (value as Model<unknown>).type === 'string' &&
        typeof (value as Model<unknown>).unknownDefinition !== 'undefined' &&
        // unknown value may be undefined, but should be present
        Object.prototype.hasOwnProperty.call(value, 'unknownValue') &&
        Object.prototype.hasOwnProperty.call(value, 'parent')
    );
}

function assertWith<T extends UnknownModel>(
    is: (model: UnknownModel) => model is T
): (model: UnknownModel) => asserts model is T {
    return (model) => {
        if (!is(model)) {
            throw new TypeError(`Model does not match ${is.name}.`);
        }
    };
}

export function isObjectModel(
    model: UnknownModel
): model is Model<Record<string, unknown>> {
    return model.unknownDefinition instanceof RigidObjectDefinition;
}
export const assertObjectModel = assertWith(isObjectModel);

export function isArrayModel(model: UnknownModel): model is Model<unknown[]> {
    return model.unknownDefinition instanceof ArrayDefinition;
}
export const assertArrayModel = assertWith(isObjectModel);

export function isUnionModel(model: UnknownModel): model is Model<unknown> {
    return model.unknownDefinition instanceof RigidObjectDefinition;
}
export const assertUnionModel = assertWith(isUnionModel);

export function isNumber(model: UnknownModel): model is Model<number> {
    return model.unknownDefinition instanceof NumberDefinition;
}
export const assertNumberModel = assertWith(isNumber);

export function isString(model: UnknownModel): model is Model<string> {
    return model.unknownDefinition instanceof StringDefinition;
}
export const assertStringModel = assertWith(isString);

export function isBoolean(model: UnknownModel): model is Model<boolean> {
    return model.unknownDefinition instanceof BooleanDefinition;
}
export const assertBooleanModel = assertWith(isBoolean);

export function isNumberConstant(model: UnknownModel): model is Model<number> {
    return model.unknownDefinition instanceof NumberConstantDefinition;
}
export const assertNumberConstantModel = assertWith(isNumberConstant);

export function isStringConstant(model: UnknownModel): model is Model<string> {
    return model.unknownDefinition instanceof StringConstantDefinition;
}
export const assertStringConstantModel = assertWith(isStringConstant);

export function isBooleanConstant(
    model: UnknownModel
): model is Model<boolean> {
    return model.unknownDefinition instanceof BooleanConstantDefinition;
}
export const assertBooleanConstantModel = assertWith(isBooleanConstant);

export function isConstant(
    model: UnknownModel
): model is Model<string> | Model<number> | Model<boolean> {
    return (
        isStringConstant(model) ||
        isNumberConstant(model) ||
        isBooleanConstant(model)
    );
}
export const assertConstantModel = assertWith(isConstant);
