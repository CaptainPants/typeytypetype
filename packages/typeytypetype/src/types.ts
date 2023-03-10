import { type Type } from './types/Type.js';
import { type Model } from './models/Model.js';

export type TypeFromDefinition<TDefinition> = TDefinition extends Type<infer T>
    ? T
    : TDefinition;

export type Replacer<T> = (value: T | Model<T>) => Promise<void>;
export type MultipleReplacer<T> = (
    value: T[] | Array<Model<T>>
) => Promise<void>;
