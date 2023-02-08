import { type TypeFromDefinition } from '../../types.js';
import { type Definition } from '../Definition.js';

export type MappedTypeFromDefinition<T> = {
    [TKey in keyof T]: TypeFromDefinition<T[TKey]>;
};

export type MappedDefinition<T> = {
    [TKey in keyof T]: Definition<T[TKey]>;
};

export type SpreadDefinition<TUnion> = TUnion extends any
    ? Definition<TUnion>
    : never;

export type Unspecialize<T extends Definition<unknown>> = T extends Definition<
    infer U
>
    ? Definition<U>
    : T;

export type UnspecializeObject<T extends Record<string, Definition<unknown>>> =
    {
        [K in keyof T]: Unspecialize<T[K]>;
    };
export type UnspecializeArray<T extends ReadonlyArray<Definition<unknown>>> = {
    [K in keyof T]: Unspecialize<T[K]>;
};
