import { Definition } from '../definitions/Definition.js';
import { Model } from './Model.js';

export interface ModelFactoryArgs<T> {
    value: T;
    definition: Definition<T>;
    depth: number;
}

export interface ModelFactory {
    create: <T>(args: ModelFactoryArgs<T>) => Model<T>;
}
