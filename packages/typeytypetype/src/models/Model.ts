import { Definition } from '../definitions/Definition';

type Maybe<T> = { [Key in keyof T]?: T[Key] };

type FixedPropertyType<T, TKey> = TKey extends keyof T ? T[TKey] : unknown;

type ExpandoPropertyType<T> = T extends Record<string, infer S> ? S : unknown;

interface ArrayModelParts<TElementType> {
    elementDefinition: () => Definition<TElementType>;

    getElement: (index: number) => Model<TElementType>;

    spliceElements: (
        index: number,
        removeCount: number,
        newElements: TElementType[]
    ) => Promise<Model<TElementType[]>>;
}

interface ObjectModelParts<T> {
    getFixedProperty: <TKey extends string>(
        key: TKey
    ) => Model<FixedPropertyType<T, TKey>>;

    setFixedProperty: <TKey extends string>(
        key: TKey,
        value: FixedPropertyType<T, TKey>
    ) => Promise<Model<T>>;

    expandoPropertyDefinition: (
        key: string
    ) => Definition<ExpandoPropertyType<T>>;

    getExpandoProperty: (
        key: string
    ) => Model<ExpandoPropertyType<T>> | undefined;

    setExpandoProperty: (
        key: string,
        value: ExpandoPropertyType<T>
    ) => Promise<Model<T>>;
}

type UnknownParts = Maybe<ArrayModelParts<unknown> & ObjectModelParts<unknown>>;

export interface ModelCommon<T, TDef extends Definition<T>> {
    readonly value: T;
    readonly definition: TDef;
    /**
     * Basically just for the original definition when looking at a union.
     */
    readonly originalDefinition: Definition<T>;
}

export type Model<T, TDef extends Definition<T> = Definition<T>> = ModelCommon<
    T,
    TDef
> &
    (T extends Array<infer S>
        ? ArrayModelParts<S>
        : T extends object
        ? ObjectModelParts<T>
        : unknown) &
    (unknown extends T ? UnknownParts : unknown);
