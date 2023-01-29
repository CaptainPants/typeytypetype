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

    #getDefinition(): Definition<T> {
        if (typeof this.definition === 'undefined')
            throw new Error('Model not provided.');
        return this.definition;
    }

    override doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return this.#getDefinition().doValidate(
            resolutionContext,
            value,
            descend(depth)
        );
    }

    override doToTypeString(depth: number): string {
        return this.name;
    }

    override arrayElementDefinition(
        value: unknown
    ): Definition<unknown> | undefined {
        return this.#getDefinition().arrayElementDefinition(value);
    }
}
