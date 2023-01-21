import { deeper } from '../internal/deeper.js';
import { MappedModel } from '../internal/utilityTypes.js';
import { ResolutionContext } from '../ResolutionContext.js';
import { Model } from './Model.js';

export class ObjectModel<
    TPropertyTypes extends Record<string, unknown>
> extends Model<TPropertyTypes> {
    constructor(modelProperies: MappedModel<TPropertyTypes>) {
        super();
        this.#modelProperties = modelProperies;
    }

    #modelProperties: MappedModel<TPropertyTypes>;

    override validateImplementation(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        if (typeof value !== 'object' || value === null) return false;

        const asRecord = value as Record<string, unknown>;

        // Looking for validation failures
        const failureIndex = Object.keys(this.#modelProperties).findIndex(
            (key) => {
                const property = this.#modelProperties[key];
                if (typeof property === 'undefined') return true; // this shouldn't happen

                const propertyValue = asRecord[key];
                if (
                    !property.validateImplementation(
                        resolutionContext,
                        propertyValue,
                        deeper(depth)
                    )
                ) {
                    return true;
                }

                return false;
            }
        );

        return failureIndex < 0;
    }

    toTypeStringImplementation(depth: number): string {
        return (
            '{\r\n' +
            Object.entries(this.#modelProperties)
                .map(
                    ([key, model]: [string, Model<unknown>]) =>
                        `    ${JSON.stringify(
                            key
                        )}: ${model.toTypeStringImplementation(
                            deeper(depth)
                        )};\r\n`
                )
                .join('') +
            '}'
        );
    }
}
