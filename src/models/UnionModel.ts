import { MappedModel } from '../internal/utilityTypes';
import { ResolutionContext } from '../ResolutionContext';
import { Model } from './Model';

export class UnionModel<TTypes extends readonly unknown[]> extends Model<
    TTypes[number]
> {
    constructor(models: MappedModel<TTypes>) {
        super();
        this.#models = models;
    }

    #models: MappedModel<TTypes>;

    override validate(
        resolutionContext: ResolutionContext,
        value: unknown
    ): boolean {
        return (
            this.#models.findIndex((model) =>
                model.validate(resolutionContext, value)
            ) >= 0
        );
    }

    toTypeString(): string {
        return this.#models
            .map((item) => `(${item.toTypeString()}})`)
            .join(' | ');
    }
}
