import { deeper } from '../internal/deeper.js';
import { MappedModel } from '../internal/utilityTypes.js';
import { ResolutionContext } from '../ResolutionContext.js';
import { Model } from './Model.js';

export class UnionModel<TTypes extends readonly unknown[]> extends Model<
    TTypes[number]
> {
    constructor(models: MappedModel<TTypes>) {
        super();
        this.#models = models;
    }

    #models: MappedModel<TTypes>;

    override doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return (
            this.#models.findIndex((model) =>
                model.doValidate(
                    resolutionContext,
                    value,
                    deeper(depth)
                )
            ) >= 0
        );
    }

    doToTypeString(depth: number): string {
        return this.#models
            .map(
                (item) => `(${item.doToTypeString(deeper(depth))}})`
            )
            .join(' | ');
    }
}
