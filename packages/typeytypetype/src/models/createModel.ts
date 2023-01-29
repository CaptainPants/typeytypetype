import { Definition } from '../definitions/Definition';
import { Model } from './Model';

export function createModel<T>(
    value: T,
    definition: Definition<T>,
    replaced: (newValue: T) => Promise<void>,
    depth: number
): Model<T> {
    return new Model<T>(value, definition, replaced, depth);
}
