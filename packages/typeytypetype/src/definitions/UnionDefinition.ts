import { descend } from '../internal/descend.js';
import {
    type SpreadDefinition,
    type MappedDefinition,
} from './internal/types.js';
import { type ResolutionContext } from './ResolutionContext.js';
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

    getDefinition(
        resolutionContext: ResolutionContext,
        value: TTypes[number]
    ): SpreadDefinition<TTypes[number]> | undefined {
        // This is showing as Definition<unknown> so I'm not sure why its not an error to return it as
        // a Definition<TTypes[number]>
        const match = this.#definitions.find((x) =>
            x.validate(resolutionContext, value)
        );

        // cheating the type system
        return match as any;
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
