import { type ArrayDefinition } from '../definitions/ArrayDefinition.js';
import { type BooleanTypeDefinition } from '../definitions/BooleanTypeDefinition.js';
import { type Definition } from '../definitions/Definition.js';
import { type NumberTypeDefinition } from '../definitions/NumberTypeDefinition.js';
import { type ObjectDefinition } from '../definitions/ObjectDefinition.js';
import { type StringTypeDefinition } from '../definitions/StringTypeDefinition.js';
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

export interface StringModel extends BaseModel<string, StringTypeDefinition> {
    readonly type: 'string';
}

export interface NumberModel extends BaseModel<number, NumberTypeDefinition> {
    readonly type: 'number';
}

export interface BooleanModel
    extends BaseModel<boolean, BooleanTypeDefinition> {
    readonly type: 'boolean';
}

export interface ArrayModel<TElement>
    extends BaseModel<TElement[], ArrayDefinition<TElement>> {
    type: 'array';

    elementDefinition: () => Definition<TElement>;

    getElement: (index: number) => Model<TElement> | undefined;

    spliceElements: (
        start: number,
        deleteCount: number,
        newElements: TElement[]
    ) => Promise<Model<TElement[]>>;
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
        StringModel &
        NumberModel &
        BooleanModel
> & { value: unknown; definition: Definition<unknown> };

export type SpreadModel<T> = T extends any ? Model<T> : never;

type SimpleModel<T> = T extends string
    ? StringModel
    : T extends number
    ? NumberModel
    : T extends boolean
    ? BooleanModel
    : never;

export type Model<T> = unknown extends T
    ? UnknownModel
    : IsUnion<T> extends true
    ? UnionModel<T>
    : T extends Array<infer TElement>
    ? ArrayModel<TElement>
    : T extends Record<string, unknown>
    ? ObjectModel<T>
    : T extends string | number | boolean
    ? SimpleModel<T>
    : never;
