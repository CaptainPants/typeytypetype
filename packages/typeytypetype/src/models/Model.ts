import { type ArrayDefinition } from '../definitions/ArrayDefinition.js';
import { type BooleanTypeDefinition } from '../definitions/BooleanTypeDefinition.js';
import { type Definition } from '../definitions/Definition.js';
import { type NumberTypeDefinition } from '../definitions/NumberTypeDefinition.js';
import { type ObjectDefinition } from '../definitions/ObjectDefinition.js';
import { type StringTypeDefinition } from '../definitions/StringTypeDefinition.js';
import { type ExpandoType, type IsUnion } from '../internal/utilityTypes.js';

export type ModelType = 'unknown' | 'union' | 'object' | 'array' | 'simple';

export interface UnknownBaseModel<TUnknownType = unknown> {
    readonly parent: ParentRelationship | null;
    readonly unknownValue: TUnknownType;
    readonly unknownDefinition: Definition<unknown>;
}

export interface BaseModel<
    T,
    TDefinition extends Definition<T> = Definition<T>,
    TUnknownType = unknown
> extends UnknownBaseModel<TUnknownType> {
    readonly value: Readonly<T>;
    readonly definition: TDefinition;
}

export interface SimpleModel<
    T,
    TDefinition extends Definition<T>,
    TType extends string
> extends BaseModel<T, TDefinition> {
    readonly type: TType;
}

export interface StringModel
    extends SimpleModel<string, StringTypeDefinition, 'string'> {}
export interface NumberModel
    extends SimpleModel<number, NumberTypeDefinition, 'number'> {}
export interface BooleanModel
    extends SimpleModel<boolean, BooleanTypeDefinition, 'boolean'> {}

export interface UnknownArrayModel extends UnknownBaseModel<unknown[]> {
    type: 'array';

    unknownElementDefinition: () => Definition<unknown>;

    unknownGetElement: (index: number) => Model<unknown> | undefined;

    unknownSpliceElements: (
        start: number,
        deleteCount: number,
        newElements: unknown[]
    ) => Promise<UnknownArrayModel>;
}

export interface ArrayModel<TElement>
    extends BaseModel<TElement[], ArrayDefinition<TElement>, unknown[]>,
        UnknownArrayModel {
    elementDefinition: () => Definition<TElement>;

    getElement: (index: number) => Model<TElement> | undefined;

    spliceElements: (
        start: number,
        deleteCount: number,
        newElements: TElement[]
    ) => Promise<Model<TElement[]>>;
}

export interface UnknownObjectModel
    extends UnknownBaseModel<Record<string, unknown>> {
    type: 'object';

    unknownExpandoPropertyDefinition: () => Definition<unknown> | undefined;

    unknownGetProperty: <TKey extends string>(key: TKey) => Model<unknown>;

    unknownSetPropertyValue: <TKey extends string>(
        key: TKey,
        value: unknown
    ) => Promise<Model<unknown>>;

    unknownDeleteProperty: (key: string) => Promise<Model<unknown>>;
}

export interface ObjectModel<TObject extends Record<string, unknown>>
    extends BaseModel<
            TObject,
            ObjectDefinition<TObject>,
            Record<string, unknown>
        >,
        UnknownObjectModel {
    expandoPropertyDefinition?: () =>
        | Definition<ExpandoType<TObject>>
        | undefined;

    getProperty: <TKey extends string>(key: TKey) => Model<TObject[TKey]>;

    setPropertyValue: <TKey extends string>(
        key: TKey,
        value: TObject[TKey]
    ) => Promise<Model<TObject>>;

    deleteProperty: (key: string) => Promise<Model<TObject>>;
}

export interface UnknownUnionModel extends UnknownBaseModel {
    type: 'union';

    as: <TAs>(definition: Definition<TAs>) => Model<TAs> | null;

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
    ? StringModel
    : T extends number
    ? NumberModel
    : T extends boolean
    ? BooleanModel
    : never;

export type UnknownModel =
    | UnknownArrayModel
    | UnknownObjectModel
    | UnknownUnionModel
    | StringModel
    | NumberModel
    | BooleanModel;

export type Model<T> = IsUnion<T> extends true
    ? UnionModel<T>
    : T extends Array<infer TElement>
    ? ArrayModel<TElement>
    : T extends Record<string, unknown>
    ? ObjectModel<T>
    : T extends string | number | boolean
    ? SimpleModels<T>
    : UnknownModel;

export type ParentRelationship =
    | { type: 'element'; model: Model<unknown>; index: number }
    | { type: 'property'; model: Model<unknown>; property: string };
