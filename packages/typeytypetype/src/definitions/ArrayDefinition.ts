import { descend } from '../internal/descend.js';
import { ResolutionContext } from '../ResolutionContext.js';
import { ElementType } from '../types.js';
import { Definition } from './Definition.js';

export class ArrayDefinition<
    T extends readonly unknown[]
> extends Definition<T> {
    constructor(itemModel: Definition<ElementType<T>>) {
        super();
        this.#elementDefinition = itemModel;
    }

    #elementDefinition: Definition<ElementType<T>>;

    override doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        if (!Array.isArray(value)) return false;

        // Any item doesn't validate against #itemModel
        return (
            value.findIndex(
                (itemValue) =>
                    !this.#elementDefinition.doValidate(
                        resolutionContext,
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

    getElementDefinition(): Definition<ElementType<T>> {
        return this.#elementDefinition;
    }
}
