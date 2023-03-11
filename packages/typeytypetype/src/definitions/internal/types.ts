import { type Definition } from '../Definition.js';
import { type PropertyDefinition } from '../PropertyDefinition.js';

export type PropertyDefinitions<TObject extends Record<string, unknown>> = {
    readonly [TKey in keyof TObject]: PropertyDefinition<TObject[TKey]>;
};

export type MappedDefinition<T> = {
    [TKey in keyof T]: Definition<T[TKey]>;
};

export type SpreadDefinition<TUnion> = TUnion extends any
    ? Definition<TUnion>
    : never;
