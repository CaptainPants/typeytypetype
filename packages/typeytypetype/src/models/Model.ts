import { type ArrayType } from '../types/ArrayType.js';
import { type BooleanType } from '../types/BooleanType.js';
import {
    type BooleanConstantType,
    type NullConstantType,
    type NumberConstantType,
    type StringConstantType,
    type UndefinedConstantType,
} from '../types/ConstantTypes.js';
import { type Type } from '../types/Type.js';
import { type NumberType } from '../types/NumberType.js';
import { type ObjectType } from '../types/ObjectType.js';
import { type StringType } from '../types/StringType.js';
import { type ExpandoType, type IsUnion } from '../internal/utilityTypes.js';
import { type PropertyModel } from './PropertyModel.js';

export type ModelType = 'unknown' | 'union' | 'object' | 'array' | 'simple';

export interface UnknownBaseModel<TUnknownType = unknown> {
    readonly unknownValue: TUnknownType;
    readonly unknownType: Type<unknown>;
}

export interface BaseModel<
    T,
    TTypeType extends Type<T> = Type<T>,
    TUnknownType = unknown
> extends UnknownBaseModel<TUnknownType> {
    readonly value: Readonly<T>;
    readonly type: TTypeType;
}

export interface SimpleModel<
    T,
    TTypeType extends Type<T>,
    TArchetype extends string
> extends BaseModel<T, TTypeType> {
    readonly archetype: TArchetype;
}

export interface StringConstantModel
    extends SimpleModel<string, StringConstantType, 'string-constant'> {}
export interface StringModel
    extends SimpleModel<string, StringType, 'string'> {}
export interface NumberConstantModel
    extends SimpleModel<number, NumberConstantType, 'number-constant'> {}
export interface NumberModel
    extends SimpleModel<number, NumberType, 'number'> {}
export interface BooleanConstantModel
    extends SimpleModel<boolean, BooleanConstantType, 'boolean-constant'> {}
export interface BooleanModel
    extends SimpleModel<boolean, BooleanType, 'boolean'> {}

export interface NullModel
    extends SimpleModel<null, NullConstantType, 'null'> {}
export interface UndefinedModel
    extends SimpleModel<undefined, UndefinedConstantType, 'undefined'> {}

export interface UnknownArrayModel extends UnknownBaseModel<unknown[]> {
    archetype: 'array';

    unknownElementType: () => Type<unknown>;

    unknownGetElement: (index: number) => Model<unknown> | undefined;

    unknownGetElements: () => ReadonlyArray<Model<unknown>>;

    unknownSpliceElements: (
        start: number,
        deleteCount: number,
        newElements: readonly unknown[]
    ) => Promise<UnknownArrayModel>;
}

export interface ArrayModel<TElement>
    extends BaseModel<TElement[], ArrayType<TElement>, unknown[]>,
        UnknownArrayModel {
    elementType: () => Type<TElement>;

    getElement: (index: number) => Model<TElement> | undefined;

    getElements: () => ReadonlyArray<Model<TElement>>;

    spliceElements: (
        start: number,
        deleteCount: number,
        newElements: ReadonlyArray<TElement | Model<TElement>>
    ) => Promise<Model<TElement[]>>;
}

export interface UnknownObjectModel
    extends UnknownBaseModel<Record<string, unknown>> {
    archetype: 'object';

    unknownExpandoPropertyType: () => Type<unknown> | undefined;

    unknownGetProperty: (key: string) => PropertyModel<unknown> | undefined;

    unknownGetProperties: () => Array<PropertyModel<unknown>>;

    unknownSetPropertyValue: (
        key: string,
        value: unknown
    ) => Promise<Model<unknown>>;

    unknownDeleteProperty: (key: string) => Promise<Model<unknown>>;
}

export interface ObjectModel<TObject extends Record<string, unknown>>
    extends BaseModel<TObject, ObjectType<TObject>, Record<string, unknown>>,
        UnknownObjectModel {
    expandoPropertyType?: () => Type<ExpandoType<TObject>> | undefined;

    getProperty: <TKey extends keyof TObject & string>(
        key: TKey
    ) => PropertyModel<TObject[TKey]>;

    setPropertyValue: <TKey extends keyof TObject & string>(
        key: TKey,
        value: TObject[TKey]
    ) => Promise<Model<TObject>>;

    deleteProperty: <TKey extends keyof TObject & string>(
        key: TKey
    ) => Promise<Model<TObject>>;
}

export interface UnknownUnionModel extends UnknownBaseModel {
    archetype: 'union';

    as: <TAs>(type: Type<TAs>) => Model<TAs> | null;

    unknownReplace: (value: unknown) => Promise<Model<unknown>>;
}

export interface UnionModel<TUnion>
    extends BaseModel<TUnion>,
        UnknownUnionModel {
    readonly resolved: SpreadModel<TUnion>;

    replace: (value: TUnion) => Promise<Model<TUnion>>;
}

export type SpreadModel<T> = T extends any ? Model<T> : never;

type SimpleModels<T> = T extends string
    ? T extends string
        ? StringModel
        : StringConstantModel
    : T extends number
    ? T extends number
        ? NumberModel
        : NumberConstantModel
    : T extends boolean
    ? T extends string
        ? StringModel
        : BooleanConstantModel
    : never;

export type UnknownModel =
    | UnknownArrayModel
    | UnknownObjectModel
    | UnknownUnionModel
    | StringModel
    | StringConstantModel
    | NumberModel
    | NumberConstantModel
    | BooleanModel
    | BooleanConstantModel
    | NullModel
    | UndefinedModel;

export type Model<T> = IsUnion<T> extends true
    ? UnionModel<T>
    : T extends Array<infer TElement>
    ? ArrayModel<TElement>
    : T extends Record<string, unknown>
    ? ObjectModel<T>
    : T extends string | number | boolean | null | undefined
    ? SimpleModels<T>
    : UnknownModel;
