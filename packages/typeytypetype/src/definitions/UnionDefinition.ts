import { descend } from '../internal/descend.js';
import { type SpreadDefinition } from './internal/types.js';
import { BaseDefinition } from './BaseDefinition.js';
import {
    type ValidationSingleResult,
    type ValidationOptions,
} from '../validation/types.js';
import { combineDefinitionPath } from '../internal/combineDefinitionPath.js';
import Queue from 'yocto-queue';

export class UnionDefinition<TUnion> extends BaseDefinition<TUnion> {
    constructor(definitions: Array<SpreadDefinition<TUnion>>) {
        super();
        this.definitions = definitions;
    }

    readonly definitions: Array<SpreadDefinition<TUnion>>;

    getDefinition(value: TUnion): SpreadDefinition<TUnion> | null {
        const queue = new Queue<SpreadDefinition<TUnion>>();
        
        for (const item of this.definitions) {
            queue.enqueue(item);
        }

        while (queue.size > 0) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const current = queue.dequeue()!;

            if (current.matches(value)) {
                return current;
            }
            else if (current instanceof UnionDefinition) {
                for (const inner of current.definitions) {
                    queue.enqueue(inner as any);
                }
            }
        }

        return null;
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
    ): Promise<ValidationSingleResult[] | undefined> {
        const def = this.getDefinition(value);

        return (await def?.doValidate(value, options, descend(depth)))?.map(
            (item) => ({
                path: combineDefinitionPath('$', item.path),
                message: item.message,
            })
        );
    }
}
