import { ResolutionContext } from '../ResolutionContext';
import { Model } from './Model';

export class ConstantModel<T> extends Model<T> {
    constructor(value: T) {
        super();
        this.#value = value;
    }

    #value: T;

    override validate(
        resolutionContext: ResolutionContext,
        value: unknown
    ): boolean {
        return value === this.#value;
    }

    override toTypeString(): string {
        return JSON.stringify(this.#value);
    }
}
