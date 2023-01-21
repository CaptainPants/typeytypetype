import { deeper } from '../internal/deeper';
import { ResolutionContext } from '../ResolutionContext';
import { Model } from './Model';

export class DelegatedModel<T> extends Model<T> {
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
        return this.#get().toTypeStringImplementation(deeper(depth));
    }
}
