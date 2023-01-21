import { ResolutionContext } from '../ResolutionContext.js';
import { Model } from './Model.js';

export class ConstantModel<T> extends Model<T> {
    constructor(value: T) {
        super();
        this.#value = value;
    }

    #value: T;

    override validateImplementation(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return value === this.#value;
    }

    override toTypeStringImplementation(depth: number): string {
        return JSON.stringify(this.#value);
    }
}
