import { type Type } from '../types/index.js';
import { StandardModelFactory } from './StandardModelFactory.js';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function createModel<T>(value: T, type: Type<T>) {
    const factory = new StandardModelFactory();
    return await factory.createModel({ value, type });
}
