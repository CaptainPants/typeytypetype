import { type TypeFromDefinition } from '../../types.js';
import { type BaseDefinition } from '../BaseDefinition.js';

export type MappedTypeFromDefinition<T> = {
    [TKey in keyof T]: TypeFromDefinition<T[TKey]>;
};

export type MappedDefinition<T> = {
    [TKey in keyof T]: BaseDefinition<T[TKey]>;
};

export type SpreadDefinition<TUnion> = TUnion extends any
    ? BaseDefinition<TUnion>
    : never;

export type Unspecialize<T extends BaseDefinition<unknown>> =
    T extends BaseDefinition<infer U> ? BaseDefinition<U> : T;

export type UnspecializeObject<
    T extends Record<string, BaseDefinition<unknown>>
> = {
    [K in keyof T]: Unspecialize<T[K]>;
};
export type UnspecializeArray<
    T extends ReadonlyArray<BaseDefinition<unknown>>
> = {
    [K in keyof T]: Unspecialize<T[K]>;
};
