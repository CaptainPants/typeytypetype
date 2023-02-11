import { descend } from '../internal/descend.js';
import { type SpreadDefinition } from './internal/types.js';
import { Definition } from './Definition.js';

export class UnionDefinition<TUnion> extends Definition<TUnion> {
    constructor(definitions: Array<SpreadDefinition<TUnion>>) {
        super();
        this.#definitions = definitions;
    }

    #definitions: Array<SpreadDefinition<TUnion>>;

    get definitions(): Array<SpreadDefinition<TUnion>> {
        return this.#definitions;
    }

    getDefinition(value: TUnion): SpreadDefinition<TUnion> | undefined {
        // This is showing as Definition<unknown> so I'm not sure why its not an error to return it as
        // a Definition<TTypes[number]>
        const match = this.#definitions.find((x) => x.matchesStructure(value));

        // cheating the type system
        return match;
    }

    override doMatchesStructure(value: unknown, depth: number): boolean {
        return (
            this.#definitions.findIndex((model) =>
                model.doMatchesStructure(value, descend(depth))
            ) >= 0
        );
    }

    override doToTypeString(depth: number): string {
        return this.#definitions
            .map((item) => `(${item.doToTypeString(descend(depth))}})`)
            .join(' | ');
    }
}
