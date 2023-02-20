import { descend } from '../internal/descend.js';
import { type SpreadDefinition } from './internal/types.js';
import { BaseDefinition } from './BaseDefinition.js';
import { type ValidationOptions } from './Validator.js';

export class UnionDefinition<TUnion> extends BaseDefinition<TUnion> {
    constructor(definitions: Array<SpreadDefinition<TUnion>>) {
        super();
        this.definitions = definitions;
    }

    readonly definitions: Array<SpreadDefinition<TUnion>>;

    getDefinition(value: TUnion): SpreadDefinition<TUnion> | undefined {
        return this.definitions.find((x) => x.matches(value));
    }

    override doMatches(
        value: unknown,
        deep: boolean,
        depth: number
    ): value is TUnion {
        return (
            this.definitions.findIndex((model) =>
                model.doMatches(value, deep, descend(depth))
            ) >= 0
        );
    }

    override doToTypeString(depth: number): string {
        return this.definitions
            .map((item) => `(${item.doToTypeString(descend(depth))}})`)
            .join(' | ');
    }

    protected override async doValidateChildren(
        value: TUnion,
        options: ValidationOptions,
        depth: number
    ): Promise<string[] | undefined> {
        const def = this.getDefinition(value);

        return await def?.doValidate(value, options, descend(depth));
    }
}
