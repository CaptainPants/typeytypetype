import { createResolutionContext } from '../createResolutionContext.js';
import { descend } from '../internal/descend.js';
import { MappedDefinition } from '../internal/utilityTypes.js';
import { ResolutionContext } from '../ResolutionContext.js';
import { Definition } from './Definition.js';

export class UnionDefinition<
    TTypes extends readonly unknown[]
> extends Definition<TTypes[number]> {
    constructor(definitions: MappedDefinition<TTypes>) {
        super();
        this.#definitions = definitions;
    }

    #definitions: MappedDefinition<TTypes>;

    get definitions(): MappedDefinition<TTypes> {
        return this.#definitions;
    }

    getDefinition(value: unknown): Definition<unknown> | undefined {
        const context = createResolutionContext();

        return this.#definitions.find((x) => x.validate(context, value));
    }

    override doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return (
            this.#definitions.findIndex((model) =>
                model.doValidate(resolutionContext, value, descend(depth))
            ) >= 0
        );
    }

    override doToTypeString(depth: number): string {
        return this.#definitions
            .map((item) => `(${item.doToTypeString(descend(depth))}})`)
            .join(' | ');
    }
}
