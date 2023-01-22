import { deeper } from '../internal/deeper.js';
import {
    MappedDefinition,
    UnionToIntersection,
} from '../internal/utilityTypes.js';
import { ResolutionContext } from '../ResolutionContext.js';
import { TypeFromModel } from '../types';
import { Definition } from './Definition.js';

export class IntersectionDefiniton<
    TTypes extends readonly unknown[]
> extends Definition<UnionToIntersection<TypeFromModel<TTypes[number]>>> {
    constructor(models: MappedDefinition<TTypes>) {
        super();
        this.#models = models;
    }

    #models: MappedDefinition<TTypes>;

    override doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return (
            this.#models.findIndex(
                (model) =>
                    !model.doValidate(resolutionContext, value, deeper(depth))
            ) < 0
        );
    }

    doToTypeString(depth: number): string {
        return this.#models
            .map((item) => `(${item.doToTypeString(deeper(depth))}})`)
            .join(' & ');
    }
}
