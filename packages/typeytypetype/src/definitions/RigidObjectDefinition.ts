import { descend } from '../internal/descend.js';
import { type BaseDefinition } from './BaseDefinition.js';
import { ObjectDefinition } from './ObjectDefinition.js';
import { type MappedDefinition } from './internal/types.js';
import { type Definition } from './Definition.js';

export class RigidObjectDefinition<
    TObject extends Record<string, unknown>
> extends ObjectDefinition<TObject> {
    constructor(propertyDefinitions: MappedDefinition<TObject>) {
        super();
        this.propertyDefinitions = propertyDefinitions;
    }

    readonly propertyDefinitions: MappedDefinition<TObject>;

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
            if (!property.doMatches(propertyValue, deep, descend(depth))) {
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
                    ([key, model]: [string, BaseDefinition<unknown>]) =>
                        `    ${JSON.stringify(key)}: ${model.doToTypeString(
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

    public override getDefinition<Key extends string>(
        key: Key
    ): Definition<TObject[Key]> | null {
        const propertyDef = this.propertyDefinitions[key];

        return propertyDef ?? null;
    }
}
