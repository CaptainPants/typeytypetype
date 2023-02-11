import { descend } from '../internal/descend.js';
import { Definition } from './Definition.js';

export class ArrayDefinition<TElement> extends Definition<TElement[]> {
    constructor(elementDefinition: Definition<TElement>) {
        super();
        this.#elementDefinition = elementDefinition;
    }

    #elementDefinition: Definition<TElement>;

    override doMatches(value: unknown, depth: number): boolean {
        if (!Array.isArray(value)) return false;

        // Any item doesn't validate against #itemModel
        return (
            value.findIndex(
                (itemValue) =>
                    !this.#elementDefinition.doMatches(
                        itemValue,
                        descend(depth)
                    )
            ) < 0
        );
    }

    override doToTypeString(depth: number): string {
        return `Array<${this.#elementDefinition.doToTypeString(
            descend(depth)
        )}>`;
    }

    getElementDefinition(): Definition<TElement> {
        return this.#elementDefinition;
    }
}
