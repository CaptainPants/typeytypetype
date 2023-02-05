import { ArrayDefinition } from '../definitions/ArrayDefinition';
import { Definition } from '../definitions/Definition';
import { ObjectDefinition } from '../definitions/ObjectDefinition';
import { RecordDefinition } from '../definitions/RecordDefinition';
import { FixedPropertyType, Maybe } from './internal/types';

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

export interface ObjectModelParts<TObject extends Record<string, unknown>>
    extends ModelCommon<TObject, ObjectDefinition<TObject>> {
        
    getFixedProperty: <TKey extends string>(
        key: TKey
    ) => Model<FixedPropertyType<TObject, TKey>>;

    setFixedProperty: <TKey extends string>(
        key: TKey,
        value: FixedPropertyType<TObject, TKey>
    ) => Promise<Model<TObject>>;
}

export interface RecordModelParts<TValue>
    extends ModelCommon<Record<string, TValue>, RecordDefinition<TValue>> {
    expandoPropertyDefinition: () => Definition<TValue> | undefined;

    getExpandoProperty: (key: string) => Model<TValue> | undefined;

    setExpandoProperty: (
        key: string,
        value: TValue
    ) => Promise<Model<Record<string, TValue>>>;

    deleteExpandoProperty: (
        key: string
    ) => Promise<Model<Record<string, TValue>>>;
}

export type UnknownParts = Maybe<
    ArrayModelParts<unknown> &
        ObjectModelParts<Record<string, unknown>> &
        RecordModelParts<unknown>
>;

export type Model<T> = unknown extends T
    ? UnknownParts
    : T extends Array<infer TElementType>
    ? ArrayModelParts<TElementType>
    : T extends Record<string, infer TRecordValue>
    ? // Narrowing to Record<string, unknown> without matching object requires some gymnastics
      // This checks if the key type is 'string' and not a subset type (which it would be for a typical object)
      string extends keyof T
        ? RecordModelParts<TRecordValue>
        : ObjectModelParts<T>
    : ModelCommon<T>;
