import { MappedModel } from '../internal/utilityTypes';
import { ResolutionContext } from '../ResolutionContext';
import { Model } from './Model';

export class ObjectModel<
    TPropertyTypes extends Record<string, unknown>
> extends Model<TPropertyTypes> {
    constructor(modelProperies: MappedModel<TPropertyTypes>) {
        super();
        this.#modelProperties = modelProperies;
    }

    #modelProperties: MappedModel<TPropertyTypes>;

    override validate(
        resolutionContext: ResolutionContext,
        value: unknown
    ): boolean {
        if (typeof value !== 'object' || value === null) return false;

        const asRecord = value as Record<string, unknown>;

        // Looking for validation failures
        const failureIndex = Object.keys(this.#modelProperties).findIndex(
            (key) => {
                const property = this.#modelProperties[key];
                if (typeof property === 'undefined') return true; // this shouldn't happen

                const propertyValue = asRecord[key];
                if (!property.validate(resolutionContext, propertyValue)) {
                    return true;
                }

                return false;
            }
        );

        return failureIndex < 0;
    }

    toTypeString(): string {
        return (
            '{\r\n' +
            Object.entries(this.#modelProperties)
                .map(
                    ([key, model]: [string, Model<unknown>]) =>
                        `    ${JSON.stringify(
                            key
                        )}: ${model.toTypeString()};\r\n`
                )
                .join('') +
            '}'
        );
    }
}
