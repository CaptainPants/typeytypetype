import { Definition } from '../definitions/Definition';
import { Model } from './Model';

export interface ModelFactoryArgs<T> {
    value: T;
    definition: Definition<T>;
    depth: number;
}

export interface ModelFactory {
    create: <T>(args: ModelFactoryArgs<T>) => Model<T>;
}
