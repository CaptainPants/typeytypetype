import { descend } from '../internal/descend.js';
import {
    MappedDefinition,
    UnionToIntersection,
} from '../internal/utilityTypes.js';
import { ResolutionContext } from '../ResolutionContext.js';
import { TypeFromDefinition } from '../types';
import { Definition } from './Definition.js';

export class IntersectionDefiniton<
    TTypes extends readonly unknown[]
> extends Definition<UnionToIntersection<TypeFromDefinition<TTypes[number]>>> {
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
                    !model.doValidate(resolutionContext, value, descend(depth))
            ) < 0
        );
    }

    doToTypeString(depth: number): string {
        return this.#models
            .map((item) => `(${item.doToTypeString(descend(depth))}})`)
            .join(' & ');
    }
}
