import { type Model } from './Model.js';

export function isModel<T>(value: T | Model<T>): value is Model<T>;
export function isModel(value: unknown): value is Model<unknown> {
    return (
        typeof (value as Model<unknown>).type === 'string' &&
        typeof (value as Model<unknown>).unknownDefinition !== 'undefined' &&
        // unknown value may be undefined, but should be present
        Object.prototype.hasOwnProperty.call(value, 'unknownValue') &&
        Object.prototype.hasOwnProperty.call(value, 'parent')
    );
}
