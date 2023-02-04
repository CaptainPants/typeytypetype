import { Definition } from '../definitions/Definition';
import { ExpandoPropertyType, FixedPropertyType, Maybe } from './internal/types';

export interface ArrayModelParts<TElementType> {
    elementDefinition: () => Definition<TElementType>;

    getElement: (index: number) => Model<TElementType> | undefined;

    spliceElements: (
        start: number,
        deleteCount: number,
        newElements: TElementType[]
    ) => Promise<Model<TElementType[]>>;
}

export interface ObjectModelParts<T> {
    getFixedProperty: <TKey extends string>(
        key: TKey
    ) => Model<FixedPropertyType<T, TKey>>;

    setFixedProperty: <TKey extends string>(
        key: TKey,
        value: FixedPropertyType<T, TKey>
    ) => Promise<Model<T>>;

    expandoPropertyDefinition: () => Definition<ExpandoPropertyType<T>> | undefined;

    getExpandoProperty: (
        key: string
    ) => Model<ExpandoPropertyType<T>> | undefined;

    setExpandoProperty: (
        key: string,
        value: ExpandoPropertyType<T>
    ) => Promise<Model<T>>;
}

type UnknownParts = Maybe<ArrayModelParts<unknown> & ObjectModelParts<unknown>>;

export interface ModelCommon<T, TDefinition extends Definition<T> = Definition<T>> {
    readonly value: T;
    readonly definition: TDefinition;
    /**
     * Basically just for the original definition when looking at a union.
     */
    readonly originalDefinition: Definition<T>;
}

export type Model<T> = ModelCommon<
    T
> &
    (T extends Array<infer TElementType>
        ? ArrayModelParts<TElementType>
        : T extends object
        ? ObjectModelParts<T>
        : unknown) &
    (unknown extends T ? UnknownParts : unknown);
