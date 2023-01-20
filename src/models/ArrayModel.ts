import { ResolutionContext } from '../ResolutionContext';
import { Model } from './Model';

export class ArrayModel<TItemType> extends Model<TItemType[]> {
    constructor(itemModel: Model<TItemType>) {
        super();
        this.#itemModel = itemModel;
    }

    #itemModel: Model<TItemType>;

    override validate(
        resolutionContext: ResolutionContext,
        value: unknown
    ): boolean {
        if (!Array.isArray(value)) return false;

        // And item doesn't validate against #itemModel
        return (
            value.findIndex(
                (x) => !this.#itemModel.validate(resolutionContext, x)
            ) >= 0
        );
    }

    override toTypeString(): string {
        return `Array<${this.#itemModel.toTypeString()}>`;
    }
}
