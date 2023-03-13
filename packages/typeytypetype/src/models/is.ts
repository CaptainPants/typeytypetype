import {
    ArrayType,
    BooleanConstantType,
    BooleanType,
    MapObjectType,
    NullConstantType,
    NumberConstantType,
    NumberType,
    RigidObjectType,
    StringConstantType,
    StringType,
    UndefinedConstantType,
} from '../types/index.js';
import { ObjectType } from '../types/ObjectType.js';
import { type Model, type UnknownModel } from './Model.js';

export function isModel<T>(value: T | Model<T>): value is Model<T>;
export function isModel(value: unknown): value is Model<unknown>;
export function isModel(value: unknown): value is Model<unknown> {
    return (
        typeof (value as Model<unknown>).unknownType === 'string' &&
        typeof (value as Model<unknown>).unknownType !== 'undefined' &&
        // unknown value may be undefined, but should be present
        Object.prototype.hasOwnProperty.call(value, 'unknownValue') &&
        Object.prototype.hasOwnProperty.call(value, 'parent')
    );
}

export function isObjectModel(
    model: UnknownModel
): model is Model<Record<string, unknown>> {
    return model.unknownType instanceof ObjectType;
}

export function isRigidObjectModel(
    model: UnknownModel
): model is Model<Record<string, unknown>> {
    return model.unknownType instanceof RigidObjectType;
}

export function isMapObjectModel(
    model: UnknownModel
): model is Model<Record<string, unknown>> {
    return model.unknownType instanceof MapObjectType;
}

export function isArrayModel(model: UnknownModel): model is Model<unknown[]> {
    return model.unknownType instanceof ArrayType;
}

export function isUnionModel(model: UnknownModel): model is Model<unknown> {
    return model.unknownType instanceof RigidObjectType;
}

export function isNumberModel(model: UnknownModel): model is Model<number> {
    return model.unknownType instanceof NumberType;
}

export function isStringModel(model: UnknownModel): model is Model<string> {
    return model.unknownType instanceof StringType;
}

export function isBooleanModel(model: UnknownModel): model is Model<boolean> {
    return model.unknownType instanceof BooleanType;
}

export function isNumberConstantModel(
    model: UnknownModel
): model is Model<number> {
    return model.unknownType instanceof NumberConstantType;
}

export function isStringConstantModel(
    model: UnknownModel
): model is Model<string> {
    return model.unknownType instanceof StringConstantType;
}
export function isBooleanConstantModel(
    model: UnknownModel
): model is Model<boolean> {
    return model.unknownType instanceof BooleanConstantType;
}

export function isNullModel(model: UnknownModel): model is Model<null> {
    return model.unknownType instanceof NullConstantType;
}

export function isUndefinedModel(model: UnknownModel): model is Model<null> {
    return model.unknownType instanceof UndefinedConstantType;
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
export const assertArrayModel = createAssert(isArrayModel);
export const assertUnionModel = createAssert(isUnionModel);
export const assertNumberModel = createAssert(isNumberModel);
export const assertStringModel = createAssert(isStringModel);
export const assertBooleanModel = createAssert(isBooleanModel);
export const assertNumberConstantModel = createAssert(isNumberConstantModel);
export const assertStringConstantModel = createAssert(isStringConstantModel);
export const assertBooleanConstantModel = createAssert(isBooleanConstantModel);
export const assertConstantModel = createAssert(isConstantModel);
