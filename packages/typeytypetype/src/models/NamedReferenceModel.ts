import { deeper } from '../internal/deeper.js';
import { ResolutionContext } from '../ResolutionContext.js';
import { Model } from './Model.js';

/**
 * This is me attempting to experimentally support recursive structures. As we can't type inference in a circle,
 * this will have to just be unknown for the time being. I guess in practice the named type itself will have a
 * definition.
 */
export class NamedReferenceModel extends Model<unknown> {
    constructor(name: string) {
        super();
        this.#name = name;
    }

    #name: string;

    override validateImplementation(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        const model = resolutionContext.getModelFromName(this.#name);

        return model.validateImplementation(
            resolutionContext,
            value,
            deeper(depth)
        );
    }

    toTypeStringImplementation(depth: number): string {
        return `Reference<${JSON.stringify(this.#name)}>`;
    }
}
