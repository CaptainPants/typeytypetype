import { type BaseDefinition } from './definitions/BaseDefinition.js';

export type TypeFromDefinition<TModel> = TModel extends BaseDefinition<infer T>
    ? T
    : TModel;

export type Replacer<T> = (value: T) => Promise<void>;

export type ElementType<T, Fallback = never> = T extends Array<infer S>
    ? S
    : Fallback;
