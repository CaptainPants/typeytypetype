import { deeper } from '../internal/deeper.js';
import { ResolutionContext } from '../ResolutionContext.js';
import { Model } from './Model.js';

export class ArrayModel<TItemType> extends Model<TItemType[]> {
    constructor(itemModel: Model<TItemType>) {
        super();
        this.#itemModel = itemModel;
    }

    #itemModel: Model<TItemType>;

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
                    !this.#itemModel.doValidate(
                        resolutionContext,
                        itemValue,
                        deeper(depth)
                    )
            ) < 0
        );
    }

    override doToTypeString(depth: number): string {
        return `Array<${this.#itemModel.doToTypeString(
            deeper(depth)
        )}>`;
    }
}
