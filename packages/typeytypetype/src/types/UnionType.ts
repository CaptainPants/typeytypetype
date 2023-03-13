import { descend } from '../internal/descend.js';
import { type SpreadUnionType } from './internal/types.js';
import { BaseType } from './BaseType.js';
import {
    type ValidationSingleResult,
    type ValidationOptions,
} from '../validation/types.js';
import { combineTypeDefinitionPath } from '../internal/combineTypeDefinitionPath.js';
import { Queue } from '@datastructures-js/queue';

export class UnionType<TUnion> extends BaseType<TUnion> {
    constructor(types: Array<SpreadUnionType<TUnion>>) {
        super();
        this.types = types;
    }

    readonly types: Array<SpreadUnionType<TUnion>>;

    getDefinition(value: TUnion): SpreadUnionType<TUnion> | null {
        const queue = new Queue<SpreadUnionType<TUnion>>();

        for (const item of this.types) {
            queue.enqueue(item);
        }

        while (!queue.isEmpty()) {
            const current = queue.dequeue();

            if (current.matches(value)) {
                return current;
            } else if (current instanceof UnionType) {
                for (const inner of current.types) {
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
            this.types.findIndex((model) =>
                model.doMatches(value, deep, descend(depth))
            ) >= 0
        );
    }

    override doToTypeString(depth: number): string {
        return this.types
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
                path: combineTypeDefinitionPath('|', item.path),
                message: item.message,
            })
        );
    }
}
