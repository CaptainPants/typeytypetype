import { type ArrayDefinition } from '../definitions/ArrayDefinition.js';
import { type Definition } from '../definitions/Definition.js';
import { type ObjectDefinition } from '../definitions/ObjectDefinition.js';
import { type IsUnion } from '../internal/utilityTypes.js';
import { type FixedPropertyType, type Maybe } from './internal/types.js';

export type ModelType = 'unknown' | 'union' | 'object' | 'array' | 'simple';

export interface BaseModel<
    T,
    TDefinition extends Definition<T> = Definition<T>
> {
    readonly value: T;
    readonly definition: TDefinition;
}

export interface SimpleModel<
    T,
    TDefinition extends Definition<T> = Definition<T>
> extends BaseModel<TDefinition> {
    type: 'simple';
}

export interface ArrayModel<TElementType>
    extends BaseModel<TElementType[], ArrayDefinition<TElementType>> {
    type: 'array';

    elementDefinition: () => Definition<TElementType>;

    getElement: (index: number) => Model<TElementType> | undefined;

    spliceElements: (
        start: number,
        deleteCount: number,
        newElements: TElementType[]
    ) => Promise<Model<TElementType[]>>;
}

export interface ObjectModel<TProperties extends Record<string, unknown>>
    extends BaseModel<TProperties, ObjectDefinition<TProperties>> {
    type: 'object';

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

export interface UnionModel<TUnion> extends BaseModel<TUnion> {
    type: 'union';

    readonly resolved: SpreadModel<TUnion>;

    as: <T>(definition: Definition<T>) => Model<T> | null;

    replace: (value: TUnion) => Promise<Model<TUnion>>;
}

export type UnknownModel = Maybe<
    ArrayModel<unknown> &
        ObjectModel<Record<string, unknown>> &
        UnionModel<unknown> &
        SimpleModel<unknown>
>;

export type SpreadModel<T> = T extends any ? Model<T> : never;

export type Model<T> = unknown extends T
    ? UnknownModel
    : IsUnion<T> extends true
    ? UnionModel<T>
    : T extends Array<infer TElementType>
    ? ArrayModel<TElementType>
    : T extends Record<string, unknown>
    ? ObjectModel<T>
    : SimpleModel<T>;
