import { descend } from '../internal/descend.js';
import { type SpreadDefinition } from './internal/types.js';
import { BaseDefinition } from './BaseDefinition.js';

export class UnionDefinition<TUnion> extends BaseDefinition<TUnion> {
    constructor(definitions: Array<SpreadDefinition<TUnion>>) {
        super();
        this.definitions = definitions;
    }

    readonly definitions: Array<SpreadDefinition<TUnion>>;

    getDefinition(value: TUnion): SpreadDefinition<TUnion> | undefined {
        // This is showing as Definition<unknown> so I'm not sure why its not an error to return it as
        // a Definition<TTypes[number]>
        const match = this.definitions.find((x) => x.matches(value));

        // cheating the type system
        return match;
    }

    override doMatches(value: unknown, depth: number): value is TUnion {
        return (
            this.definitions.findIndex((model) =>
                model.doMatches(value, descend(depth))
            ) >= 0
        );
    }

    override doToTypeString(depth: number): string {
        return this.definitions
            .map((item) => `(${item.doToTypeString(descend(depth))}})`)
            .join(' | ');
    }
}
