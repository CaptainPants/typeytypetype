import { type Definition } from '../definitions/Definition.js';
import { type Model } from './Model.js';

export interface CreateModelArgs<T> {
    value: unknown;
    definition: Definition<T>;
}

export interface CreateUnvalidatedModelPartArgs<T> {
    value: T;
    definition: Definition<T>;
    depth: number;
}

export interface ModelFactory {
    createModel: <T>(args: CreateModelArgs<T>) => Promise<Model<T>>;

    createUnvalidatedModelPart: <T>(
        args: CreateUnvalidatedModelPartArgs<T>
    ) => Model<T>;
}
