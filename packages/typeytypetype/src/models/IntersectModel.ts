import { deeper } from '../internal/deeper.js';
import { MappedModel, UnionToIntersection } from '../internal/utilityTypes.js';
import { ResolutionContext } from '../ResolutionContext.js';
import { TypeFromModel } from '../types';
import { Model } from './Model.js';

export class IntersectModel<TTypes extends readonly unknown[]> extends Model<
    UnionToIntersection<TypeFromModel<TTypes[number]>>
> {
    constructor(models: MappedModel<TTypes>) {
        super();
        this.#models = models;
    }

    #models: MappedModel<TTypes>;

    override validateImplementation(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return (
            this.#models.findIndex(
                (model) =>
                    !model.validateImplementation(
                        resolutionContext,
                        value,
                        deeper(depth)
                    )
            ) < 0
        );
    }

    toTypeStringImplementation(depth: number): string {
        return this.#models
            .map(
                (item) => `(${item.toTypeStringImplementation(deeper(depth))}})`
            )
            .join(' & ');
    }
}
