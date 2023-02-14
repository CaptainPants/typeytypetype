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

/**
 * This is not in use but is cool so keeping it around.
 */
export type TupleToIntersection<TArgs extends readonly unknown[]> =
    UnionToIntersection<TArgs[number]>;

// The brute force approach that also works:

// type TupleToIntersection<TArgs extends readonly unknown[]> = TArgs extends [infer Only]
//   ? Only
//   : TArgs extends [infer First, ...infer Rest]
//   ? First & Intersect<Rest>
//   : never;

// https://ghaiklor.github.io/type-challenges-solutions/en/medium-isunion.html
// Voodoo magic in that T is distributed by the condition, so [T] will be a single element of a union vs [C] will be the whole union
export type IsUnion<T, C = T> = T extends C
    ? [C] extends [T]
        ? false
        : true
    : never;
