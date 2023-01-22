import { descend } from '../internal/descend.js';
import { ResolutionContext } from '../ResolutionContext.js';
import { Definition } from './Definition.js';

export class NamedDefinition<T> extends Definition<T> {
    constructor(name: string, model?: Definition<T>) {
        super();
        this.name = name;
        this.definition = model;
    }

    public name: string;
    public definition: Definition<T> | undefined;

    #get(): Definition<T> {
        if (typeof this.definition === 'undefined')
            throw new Error('Model not provided.');
        return this.definition;
    }

    doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return this.#get().doValidate(resolutionContext, value, descend(depth));
    }

    doToTypeString(depth: number): string {
        return this.name;
    }
}
