import { descend } from '../internal/descend.js';
import { ObjectDefinition } from './ObjectDefinition.js';
import { type PropertyDefinitions } from './internal/types.js';
import { type PropertyDefinition } from './PropertyDefinition.js';

export class RigidObjectDefinition<
    TObject extends Record<string, unknown>
> extends ObjectDefinition<TObject> {
    constructor(propertyDefinitions: PropertyDefinitions<TObject>) {
        super();
        this.propertyDefinitions = propertyDefinitions;
    }

    readonly propertyDefinitions: PropertyDefinitions<TObject>;

    override doMatches(
        value: unknown,
        deep: boolean,
        depth: number
    ): value is TObject {
        if (typeof value !== 'object' || value === null) return false;

        if (!deep) {
            return true;
        }

        const asRecord = value as Record<string, unknown>;

        // Looking for validation failures
        const fixedPropertiesFailureIndex = Object.keys(
            this.propertyDefinitions
        ).findIndex((key) => {
            const property = this.propertyDefinitions[key];
            if (typeof property === 'undefined') return true; // this shouldn't happen

            const propertyValue = asRecord[key];
            if (!property.type.doMatches(propertyValue, deep, descend(depth))) {
                return true;
            }

            return false;
        });

        return fixedPropertiesFailureIndex < 0;
    }

    override doToTypeString(depth: number): string {
        return (
            '{\r\n' +
            Object.entries(this.propertyDefinitions)
                .map(
                    ([key, prop]: [string, PropertyDefinition<unknown>]) =>
                        `    ${JSON.stringify(key)}: ${prop.type.doToTypeString(
                            descend(depth)
                        )};\r\n`
                )
                .join('') +
            '}'
        );
    }

    public override getFixedPropertyNames(): string[] {
        return Object.keys(this.propertyDefinitions);
    }

    public override getPropertyDefinition<Key extends string>(
        key: Key
    ): PropertyDefinition<TObject[Key]> | null {
        const propertyDef = this.propertyDefinitions[key];

        return propertyDef ?? null;
    }
}
