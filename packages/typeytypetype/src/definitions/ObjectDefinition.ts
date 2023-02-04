import * as assert from 'typed-assert';
import { descend } from '../internal/descend.js';
import { MappedDefinition } from '../internal/utilityTypes.js';
import { ResolutionContext } from '../ResolutionContext.js';
import { Definition } from './Definition.js';

export class ObjectDefinition<
    TPropertyTypes extends Record<string, unknown>,
    TExpandoPropertyType = never
> extends Definition<TPropertyTypes> {
    constructor(
        propertyDefinitions: MappedDefinition<TPropertyTypes>,
        expandoDefinition?: Definition<TExpandoPropertyType>
    ) {
        super();
        this.#fixedPropertyDefinitions = propertyDefinitions;
        this.#expandoDefinition = expandoDefinition;
    }

    #fixedPropertyDefinitions: MappedDefinition<TPropertyTypes>;
    #expandoDefinition: Definition<TExpandoPropertyType> | undefined;

    override doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        if (typeof value !== 'object' || value === null) return false;

        const asRecord = value as Record<string, unknown>;

        // Looking for properties missing from value
        const fixedPropertyMissingIndex = Object.keys(
            this.#fixedPropertyDefinitions
        ).findIndex((key) => {
            const property = this.#fixedPropertyDefinitions[key];
            assert.isNotUndefined(property);

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

        if (fixedPropertyMissingIndex >= 0) {
            return false;
        }

        const badInputProperties = Object.keys(asRecord).findIndex((item) => {
            const fixed = this.#fixedPropertyDefinitions[item];

            if (fixed !== undefined) return false; // Fixed properties are fine and already checked

            // No expando properties allowed
            if (this.#expandoDefinition === undefined) return true;

            const propertyValue = asRecord[item];

            return !this.#expandoDefinition.doValidate(
                resolutionContext,
                propertyValue,
                descend(depth)
            );
        });

        return badInputProperties < 0;
    }

    override doToTypeString(depth: number): string {
        return (
            '{\r\n' +
            Object.entries(this.#fixedPropertyDefinitions)
                .map(
                    ([key, model]: [string, Definition<unknown>]) =>
                        `    ${JSON.stringify(key)}: ${model.doToTypeString(
                            descend(depth)
                        )};\r\n`
                )
                .join('') +
            (this.#expandoDefinition !== undefined
                ? `[key: string]: ${this.#expandoDefinition.doToTypeString(
                      descend(depth)
                  )}\r\n`
                : '') +
            '}'
        );
    }

    public getFixedPropertyNames(): string[] {
        return Object.keys(this.#fixedPropertyDefinitions);
    }

    public getDefinition(key: string): Definition<unknown> | undefined {
        const fixed = this.#fixedPropertyDefinitions[key];

        if (fixed !== undefined) {
            return fixed;
        }

        // is undefined if not allowed
        return this.#expandoDefinition;
    }

    public getExpandoDefinition():
        | Definition<TExpandoPropertyType>
        | undefined {
        return this.#expandoDefinition;
    }
}
