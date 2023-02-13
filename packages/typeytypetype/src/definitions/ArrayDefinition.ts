import { descend } from '../internal/descend.js';
import { type ElementType } from '../types.js';
import { Definition } from './Definition.js';

export class ArrayDefinition<
    TArray extends readonly unknown[]
> extends Definition<TArray> {
    constructor(elementDefinition: Definition<ElementType<TArray>>) {
        super();
        this.elementDefinition = elementDefinition;
    }

    public readonly elementDefinition: Definition<ElementType<TArray>>;

    override doMatches(value: unknown, depth: number): boolean {
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

    getElementDefinition(): Definition<ElementType<TArray>> {
        return this.elementDefinition;
    }
}
