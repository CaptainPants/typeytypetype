import { ResolutionContext } from '../ResolutionContext';
import { Model } from './Model';

export class DelegatedModel<T> extends Model<T> {
    public model: Model<T> | undefined;

    #get(): Model<T> {
        if (typeof this.model === 'undefined')
            throw new Error('Model not provided.');
        return this.model;
    }

    validate(resolutionContext: ResolutionContext, value: unknown): boolean {
        return this.#get().validate(resolutionContext, value);
    }

    toTypeString(): string {
        return this.#get().toTypeString();
    }
}
