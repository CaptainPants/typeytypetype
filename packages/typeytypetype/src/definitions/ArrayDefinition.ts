import { descend } from '../internal/descend.js';
import { type ElementType } from '../types.js';
import { BaseDefinition } from './BaseDefinition.js';

export class ArrayDefinition<
    TArray extends readonly unknown[]
> extends BaseDefinition<TArray> {
    constructor(elementDefinition: BaseDefinition<ElementType<TArray>>) {
        super();
        this.elementDefinition = elementDefinition;
    }

    public readonly elementDefinition: BaseDefinition<ElementType<TArray>>;

    override doMatches(value: unknown, depth: number): value is TArray {
        if (!Array.isArray(value)) return false;

        // Any item doesn't validate against #itemModel
        return (
            value.findIndex(
                (itemValue) =>
                    !this.elementDefinition.doMatches(itemValue, descend(depth))
            ) < 0
        );
    }

    override doToTypeString(depth: number): string {
        return `Array<${this.elementDefinition.doToTypeString(
            descend(depth)
        )}>`;
    }

    getElementDefinition(): BaseDefinition<ElementType<TArray>> {
        return this.elementDefinition;
    }
}
