import { type ArrayDefinition } from '../definitions/ArrayDefinition.js';
import { type Definition } from '../definitions/Definition.js';
import { type ObjectDefinition } from '../definitions/ObjectDefinition.js';
import { type IsUnion } from '../internal/utilityTypes.js';
import { type FixedPropertyType, type Maybe } from './internal/types.js';

export interface ModelCommon<
    T,
    TDefinition extends Definition<T> = Definition<T>
> {
    readonly value: T;
    readonly definition: TDefinition;
}

export interface ArrayModelParts<TElementType>
    extends ModelCommon<TElementType[], ArrayDefinition<TElementType>> {
    elementDefinition: () => Definition<TElementType>;

    getElement: (index: number) => Model<TElementType> | undefined;

    spliceElements: (
        start: number,
        deleteCount: number,
        newElements: TElementType[]
    ) => Promise<Model<TElementType[]>>;
}

export interface ObjectModelParts<TProperties extends Record<string, unknown>>
    extends ModelCommon<TProperties, ObjectDefinition<TProperties>> {
    expandoPropertyDefinition?: () => Definition<unknown> | undefined;

    getProperty: <TKey extends string>(
        key: TKey
    ) => Model<FixedPropertyType<TProperties, TKey>>;

    setPropertyValue: <TKey extends string>(
        key: TKey,
        value: FixedPropertyType<TProperties, TKey>
    ) => Promise<Model<TProperties>>;

    deleteProperty: (key: string) => Promise<Model<TProperties>>;
}

export interface UnionModelParts<TUnion> extends ModelCommon<TUnion> {
    readonly resolved: SpreadModel<TUnion>;

    replace: (value: TUnion) => Promise<Model<TUnion>>;
}

export type UnknownParts = Maybe<
    ArrayModelParts<unknown> &
        ObjectModelParts<Record<string, unknown>> &
        UnionModelParts<unknown>
>;

export type SpreadModel<T> = T extends any ? Model<T> : never;

export type Model<T> = unknown extends T
    ? UnknownParts
    : IsUnion<T> extends true
    ? UnionModelParts<T>
    : T extends Array<infer TElementType>
    ? ArrayModelParts<TElementType>
    : T extends Record<string, unknown>
    ? ObjectModelParts<T>
    : ModelCommon<T>;
