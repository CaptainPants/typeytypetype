import { descend } from '../internal/descend.js';
import { MappedDefinition } from '../internal/utilityTypes.js';
import { ResolutionContext } from '../ResolutionContext.js';
import { Definition } from './Definition.js';

export class ObjectDefinition<
    TPropertyTypes extends Record<string, unknown>
> extends Definition<TPropertyTypes> {
    constructor(modelProperies: MappedDefinition<TPropertyTypes>) {
        super();
        this.#propertyDefinitions = modelProperies;
    }

    #propertyDefinitions: MappedDefinition<TPropertyTypes>;

    override doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        if (typeof value !== 'object' || value === null) return false;

        const asRecord = value as Record<string, unknown>;

        // Looking for validation failures
        const failureIndex = Object.keys(this.#propertyDefinitions).findIndex(
            (key) => {
                const property = this.#propertyDefinitions[key];
                if (typeof property === 'undefined') return true; // this shouldn't happen

                const propertyValue = asRecord[key];
                if (
                    !property.doValidate(
                        resolutionContext,
                        propertyValue,
                        descend(depth)
                    )
                ) {
                    return true;
                }

                return false;
            }
        );

        return failureIndex < 0;
    }

    doToTypeString(depth: number): string {
        return (
            '{\r\n' +
            Object.entries(this.#propertyDefinitions)
                .map(
                    ([key, model]: [string, Definition<unknown>]) =>
                        `    ${JSON.stringify(key)}: ${model.doToTypeString(
                            descend(depth)
                        )};\r\n`
                )
                .join('') +
            '}'
        );
    }
}
