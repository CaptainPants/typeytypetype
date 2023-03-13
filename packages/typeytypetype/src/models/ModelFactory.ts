import { type Type } from '../types/Type.js';
import { type Model } from './Model.js';

export interface CreateModelArgs<T> {
    value: unknown;
    type: Type<T>;
}

export interface CreateUnvalidatedModelPartArgs<T> {
    value: T;
    type: Type<T>;
    depth: number;
}

export interface ModelFactory {
    createModel: <T>(args: CreateModelArgs<T>) => Promise<Model<T>>;

    createUnvalidatedModelPart: <T>(
        args: CreateUnvalidatedModelPartArgs<T>
    ) => Model<T>;
}
