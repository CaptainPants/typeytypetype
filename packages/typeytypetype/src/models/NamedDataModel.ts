import { deeper } from '../internal/deeper.js';
import { ResolutionContext } from '../ResolutionContext.js';
import { Model } from './Model.js';

export class NamedDataModel<T> extends Model<T> {
    constructor(name: string, model?: Model<T>) {
        super();
        this.name = name;
        this.model = model;
    }

    public name: string;
    public model: Model<T> | undefined;

    #get(): Model<T> {
        if (typeof this.model === 'undefined')
            throw new Error('Model not provided.');
        return this.model;
    }

    doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return this.#get().doValidate(resolutionContext, value, deeper(depth));
    }

    doToTypeString(depth: number): string {
        return this.name;
    }
}
