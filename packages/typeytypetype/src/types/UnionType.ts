import { descend } from '../internal/descend.js';
import { type SpreadUnionType } from './internal/types.js';
import { BaseType } from './BaseType.js';
import {
    type ValidationSingleResult,
    type ValidationOptions,
} from '../validation/types.js';
import { combineTypeDefinitionPath } from '../internal/combineTypeDefinitionPath.js';
import { Queue } from '@datastructures-js/queue';

/**
 * Deal with the possibility of nested unions. Typescript flattens them into a single
 * union so our structures need to follow suit in order to give predictable results.
 */
function unroll<TUnion>(
    types: Array<SpreadUnionType<TUnion>>
): Array<SpreadUnionType<TUnion>> {
    const res: Array<SpreadUnionType<TUnion>> = [];

    const queue = new Queue<SpreadUnionType<TUnion>>();

    for (const item of types) {
        queue.enqueue(item);
    }

    while (!queue.isEmpty()) {
        const current = queue.dequeue();

        queue.push(current);

        if (current instanceof UnionType) {
            for (const inner of current.types) {
                queue.enqueue(inner as any);
            }
        }
    }

    return res;
}

export class UnionType<TUnion> extends BaseType<TUnion> {
    constructor(types: Array<SpreadUnionType<TUnion>>) {
        super();
        this.types = unroll(types);
    }

    readonly types: Array<SpreadUnionType<TUnion>>;

    getTypeForValue(value: TUnion): SpreadUnionType<TUnion> | null {
        const match = this.types.find((x) => x.matches(value)) ?? null;
        return match;
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
        const def = this.getTypeForValue(value);

        return (await def?.doValidate(value, options, descend(depth)))?.map(
            (item) => ({
                path: combineTypeDefinitionPath('|', item.path),
                message: item.message,
            })
        );
    }
}
