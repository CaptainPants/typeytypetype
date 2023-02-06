import { ArrayDefinition } from '../definitions/ArrayDefinition.js';
import { Definition } from '../definitions/Definition.js';
import { ObjectDefinition } from '../definitions/ObjectDefinition.js';
import { FixedPropertyType, Maybe } from './internal/types.js';

export interface ModelCommon<
    T,
    TDefinition extends Definition<T> = Definition<T>
> {
    readonly value: T;
    readonly definition: TDefinition;
    /**
     * Basically just for the original definition when looking at a union.
     */
    readonly originalDefinition: Definition<T>;
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

export type UnknownParts = Maybe<
    ArrayModelParts<unknown> & ObjectModelParts<Record<string, unknown>>
>;

export type Model<T> = unknown extends T
    ? UnknownParts
    : T extends Array<infer TElementType>
    ? ArrayModelParts<TElementType>
    : T extends Record<string, unknown>
    ? ObjectModelParts<T>
    : ModelCommon<T>;
