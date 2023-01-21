import { deeper } from '../internal/deeper.js';
import { ResolutionContext } from '../ResolutionContext.js';
import { Model } from './Model.js';

export class NamedDataModel<T> extends Model<T> {
    constructor(name: string) {
        super();
        this.name = name;
    }

    public name: string;
    public model: Model<T> | undefined;

    #get(): Model<T> {
        if (typeof this.model === 'undefined')
            throw new Error('Model not provided.');
        return this.model;
    }

    validateImplementation(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return this.#get().validateImplementation(
            resolutionContext,
            value,
            deeper(depth)
        );
    }

    toTypeStringImplementation(depth: number): string {
        return this.name;
    }
}
