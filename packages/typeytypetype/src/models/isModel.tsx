import { ModelImpl } from './internal/ModelImpl.js';
import { type Model } from './Model.js';

export function isModel<T>(value: T | Model<T>): value is Model<T>;
export function isModel(value: unknown): value is Model<unknown> {
    return value instanceof ModelImpl;
}
