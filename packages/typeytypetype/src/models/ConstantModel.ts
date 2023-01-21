import { ResolutionContext } from '../ResolutionContext.js';
import { Model } from './Model.js';

export class ConstantModel<T> extends Model<T> {
    constructor(value: T) {
        super();
        this.#value = value;
    }

    #value: T;

    override doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return value === this.#value;
    }

    override doToTypeString(depth: number): string {
        return JSON.stringify(this.#value);
    }
}
