import { descend } from '../internal/descend.js';
import { type Definition } from './Definition.js';
import { ObjectDefinition } from './ObjectDefinition.js';

export class MapObjectDefinition<TValue> extends ObjectDefinition<
    Record<string, TValue>
> {
    constructor(propertyDefinition: Definition<TValue>) {
        super();
        this.propertyDefinition = propertyDefinition;
    }

    readonly propertyDefinition: Definition<TValue>;

    override doMatches(
        value: unknown,
        deep: boolean,
        depth: number
    ): value is Record<string, TValue> {
        if (typeof value !== 'object' || value === null) return false;

        if (!deep) {
            return true;
        }

        const asRecord = value as Record<string, unknown>;

        // Looking for validation failures
        const inputPropertyFailures = Object.keys(value).findIndex((key) => {
            const property = (value as Record<string, unknown>)[key];
            if (typeof property === 'undefined') return true; // this shouldn't happen

            const propertyValue = asRecord[key];
            if (
                !this.propertyDefinition.doMatches(
                    propertyValue,
                    deep,
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
        return `Record<string, ${this.propertyDefinition.doToTypeString(
            descend(depth)
        )}>`;
    }

    public override getDefinition<Key extends string>(
        key: Key
    ): Definition<TValue> | null {
        return this.propertyDefinition;
    }

    public override getExpandoDefinition(): Definition<TValue> | undefined {
        return this.propertyDefinition;
    }
}
