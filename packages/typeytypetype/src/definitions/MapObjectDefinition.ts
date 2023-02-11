import { descend } from '../internal/descend.js';
import { type FixedPropertyType } from '../models/internal/types.js';
import { type Definition } from './Definition.js';
import { ObjectDefinition } from './ObjectDefinition.js';

export class MapObjectDefinition<TValue> extends ObjectDefinition<
    Record<string, TValue>
> {
    constructor(propertyDefinition: Definition<TValue>) {
        super();
        this.#propertyDefinition = propertyDefinition;
    }

    #propertyDefinition: Definition<TValue>;

    override doMatchesStructure(value: unknown, depth: number): boolean {
        if (typeof value !== 'object' || value === null) return false;

        const asRecord = value as Record<string, unknown>;

        // Looking for validation failures
        const inputPropertyFailures = Object.keys(value).findIndex((key) => {
            const property = (value as Record<string, unknown>)[key];
            if (typeof property === 'undefined') return true; // this shouldn't happen

            const propertyValue = asRecord[key];
            if (
                !this.#propertyDefinition.doMatchesStructure(
                    propertyValue,
                    descend(depth)
                )
            ) {
                return true;
            }

            return false;
        });

        return inputPropertyFailures < 0;
    }

    override doToTypeString(depth: number): string {
        return `Record<string, ${this.#propertyDefinition.doToTypeString(
            descend(depth)
        )}>`;
    }

    public override getDefinition<Key extends string>(
        key: Key
    ): Definition<FixedPropertyType<Record<string, TValue>, Key>> | undefined {
        return this.#propertyDefinition as any;
    }
}
