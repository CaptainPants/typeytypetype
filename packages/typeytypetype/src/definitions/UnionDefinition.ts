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

    doToTypeString(depth: number): string {
        return this.#definitions
            .map((item) => `(${item.doToTypeString(descend(depth))}})`)
            .join(' | ');
    }
}
