import { type Definition } from '../definitions';
import { StandardModelFactory } from './StandardModelFactory.js';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function createModel<T>(value: T, definition: Definition<T>) {
    const factory = new StandardModelFactory();
    return await factory.createModel({ value, definition });
}
