import { deeper } from '../internal/deeper.js';
import { ResolutionContext } from '../ResolutionContext.js';
import { Model } from './Model.js';

export class ArrayModel<TItemType> extends Model<TItemType[]> {
    constructor(itemModel: Model<TItemType>) {
        super();
        this.#itemModel = itemModel;
    }

    #itemModel: Model<TItemType>;

    override validateImplementation(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        if (!Array.isArray(value)) return false;

        // Any item doesn't validate against #itemModel
        return (
            value.findIndex(
                (itemValue) =>
                    !this.#itemModel.validateImplementation(
                        resolutionContext,
                        itemValue,
                        deeper(depth)
                    )
            ) < 0
        );
    }

    override toTypeStringImplementation(depth: number): string {
        return `Array<${this.#itemModel.toTypeStringImplementation(
            deeper(depth)
        )}>`;
    }
}
