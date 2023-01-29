import { Definition } from '../definitions/Definition';
import { Model } from './Model';

export function createModel<T>(
    value: T,
    definition: Definition<T>,
    replaced: (newValue: T) => Promise<void>
): Model<T> {
    throw new Error('');
}
