import { descend } from '../internal/descend.js';
import { type FixedPropertyType } from '../models/internal/types.js';
import { type ResolutionContext } from './ResolutionContext.js';
import { type Definition } from './Definition.js';
import { ObjectDefinition } from './ObjectDefinition.js';
import { type MappedDefinition } from './internal/types.js';

export class RigidObjectDefinition<
    TObject extends Record<string, unknown>
> extends ObjectDefinition<TObject> {
    constructor(propertyDefinitions: MappedDefinition<TObject>) {
        super();
        this.#propertyDefinitions = propertyDefinitions;
    }

    #propertyDefinitions: MappedDefinition<TObject>;

    override doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        if (typeof value !== 'object' || value === null) return false;

        const asRecord = value as Record<string, unknown>;

        // Looking for validation failures
        const fixedPropertiesFailureIndex = Object.keys(
            this.#propertyDefinitions
        ).findIndex((key) => {
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
        });

        return fixedPropertiesFailureIndex < 0;
    }

    override doToTypeString(depth: number): string {
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

    public override getFixedPropertyNames(): string[] {
        return Object.keys(this.#propertyDefinitions);
    }

    public override getDefinition<Key extends string>(
        key: Key
    ): Definition<FixedPropertyType<TObject, Key>> | undefined {
        const propertyDef = this.#propertyDefinitions[key];

        return propertyDef as any;
    }
}
