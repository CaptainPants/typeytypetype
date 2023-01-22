import { Definition } from '../definitions/Definition';
import { TypeFromModel } from '../types';

export type MappedTypeFromDefinition<T> = {
    [TKey in keyof T]: TypeFromModel<T[TKey]>;
};

export type MappedDefinition<T> = {
    [TKey in keyof T]: Definition<T[TKey]>;
};

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

/**
 * This is some true black magic: https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
 * Which references https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types
 * and https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types
 */
export type UnionToIntersection<U> = (
    U extends any ? (k: U) => void : never
) extends (k: infer I) => void
    ? I
    : never;

export type TupleToIntersection<TArgs extends readonly unknown[]> =
    UnionToIntersection<TArgs[number]>;

// The brute force approach that also works:

// type TupleToIntersection<TArgs extends readonly unknown[]> = TArgs extends [infer Only]
//   ? Only
//   : TArgs extends [infer First, ...infer Rest]
//   ? First & Intersect<Rest>
//   : never;
