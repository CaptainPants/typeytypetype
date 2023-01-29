import { Definition } from '../definitions/Definition';
import { Model } from './Model';

export interface ModelFactory {
    create: <T>(
        value: T,
        definition: Definition<T>,
        replaced: (newValue: T) => Promise<void>,
        depth: number
    ) => Model<T>;
}
