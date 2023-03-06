import {
    ArrayDefinition,
    BooleanConstantDefinition,
    BooleanDefinition,
    MapObjectDefinition,
    NullConstantDefinition,
    NumberConstantDefinition,
    NumberDefinition,
    RigidObjectDefinition,
    StringConstantDefinition,
    StringDefinition,
    UndefinedConstantDefinition,
} from '../definitions';
import { ObjectDefinition } from '../definitions/ObjectDefinition.js';
import { type Model, type UnknownModel } from './Model.js';

export function isModel<T>(value: T | Model<T>): value is Model<T>;
export function isModel(value: unknown): value is Model<unknown>;
export function isModel(value: unknown): value is Model<unknown> {
    return (
        typeof (value as Model<unknown>).type === 'string' &&
        typeof (value as Model<unknown>).unknownDefinition !== 'undefined' &&
        // unknown value may be undefined, but should be present
        Object.prototype.hasOwnProperty.call(value, 'unknownValue') &&
        Object.prototype.hasOwnProperty.call(value, 'parent')
    );
}

export function isObjectModel(
    model: UnknownModel
): model is Model<Record<string, unknown>> {
    return model.unknownDefinition instanceof ObjectDefinition;
}

export function isRigidObjectModel(
    model: UnknownModel
): model is Model<Record<string, unknown>> {
    return model.unknownDefinition instanceof RigidObjectDefinition;
}

export function isMapObjectModel(
    model: UnknownModel
): model is Model<Record<string, unknown>> {
    return model.unknownDefinition instanceof MapObjectDefinition;
}

export function isArrayModel(model: UnknownModel): model is Model<unknown[]> {
    return model.unknownDefinition instanceof ArrayDefinition;
}

export function isUnionModel(model: UnknownModel): model is Model<unknown> {
    return model.unknownDefinition instanceof RigidObjectDefinition;
}

export function isNumberModel(model: UnknownModel): model is Model<number> {
    return model.unknownDefinition instanceof NumberDefinition;
}

export function isStringModel(model: UnknownModel): model is Model<string> {
    return model.unknownDefinition instanceof StringDefinition;
}

export function isBooleanModel(model: UnknownModel): model is Model<boolean> {
    return model.unknownDefinition instanceof BooleanDefinition;
}

export function isNumberConstantModel(
    model: UnknownModel
): model is Model<number> {
    return model.unknownDefinition instanceof NumberConstantDefinition;
}

export function isStringConstantModel(
    model: UnknownModel
): model is Model<string> {
    return model.unknownDefinition instanceof StringConstantDefinition;
}
export function isBooleanConstantModel(
    model: UnknownModel
): model is Model<boolean> {
    return model.unknownDefinition instanceof BooleanConstantDefinition;
}

export function isNullModel(model: UnknownModel): model is Model<null> {
    return model.unknownDefinition instanceof NullConstantDefinition;
}

export function isUndefinedModel(model: UnknownModel): model is Model<null> {
    return model.unknownDefinition instanceof UndefinedConstantDefinition;
}

export function isConstantModel(
    model: UnknownModel
): model is
    | Model<string>
    | Model<number>
    | Model<boolean>
    | Model<null>
    | Model<undefined> {
    return (
        isStringConstantModel(model) ||
        isNumberConstantModel(model) ||
        isBooleanConstantModel(model) ||
        isNullModel(model) ||
        isUndefinedModel(model)
    );
}

// ==== Assertions for each isX functions
function createAssert<T extends UnknownModel>(
    is: (model: UnknownModel) => model is T
): (model: UnknownModel) => asserts model is T {
    return (model) => {
        if (!is(model)) {
            throw new TypeError(`Model does not match ${is.name}.`);
        }
    };
}

export const assertIsModel = createAssert(isModel);
export const assertObjectModel = createAssert(isObjectModel);
export const assertRigidObjectModel = createAssert(isRigidObjectModel);
export const assertMapObjectModel = createAssert(isMapObjectModel);
export const assertArrayModel = createAssert(isRigidObjectModel);
export const assertUnionModel = createAssert(isUnionModel);
export const assertNumberModel = createAssert(isNumberModel);
export const assertStringModel = createAssert(isStringModel);
export const assertBooleanModel = createAssert(isBooleanModel);
export const assertNumberConstantModel = createAssert(isNumberConstantModel);
export const assertStringConstantModel = createAssert(isStringConstantModel);
export const assertBooleanConstantModel = createAssert(isBooleanConstantModel);
export const assertConstantModel = createAssert(isConstantModel);
