import { MappedModel, UnionToIntersection } from '../internal/utilityTypes';
import { ResolutionContext } from '../ResolutionContext';
import { TypeFromModel } from '../types';
import { Model } from './Model';

export class IntersectModel<TTypes extends readonly unknown[]> extends Model<
    UnionToIntersection<TypeFromModel<TTypes[number]>>
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
            this.#models.findIndex(
                (model) => !model.validate(resolutionContext, value)
            ) < 0
        );
    }

    toTypeString(): string {
        return this.#models
            .map((item) => `(${item.toTypeString()}})`)
            .join(' & ');
    }
}
