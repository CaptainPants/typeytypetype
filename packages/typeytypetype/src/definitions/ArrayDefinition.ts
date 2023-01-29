import { descend } from '../internal/descend.js';
import { ResolutionContext } from '../ResolutionContext.js';
import { Definition } from './Definition.js';

export class ArrayDefinition<TItemType> extends Definition<TItemType[]> {
    constructor(itemModel: Definition<TItemType>) {
        super();
        this.#elementDefinition = itemModel;
    }

    #elementDefinition: Definition<TItemType>;

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

    override arrayElementDefinition(
        value: unknown
    ): Definition<unknown> | undefined {
        return this.#elementDefinition;
    }
}
