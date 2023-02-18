import { type TypeFromDefinition } from '../../types.js';
import { type Definition } from '../Definition.js';

export type MappedTypeFromDefinition<T> = {
    readonly [TKey in keyof T]: TypeFromDefinition<T[TKey]>;
};

export type MappedDefinition<T> = {
    [TKey in keyof T]: Definition<T[TKey]>;
};

export type SpreadDefinition<TUnion> = TUnion extends any
    ? Definition<TUnion>
    : never;
