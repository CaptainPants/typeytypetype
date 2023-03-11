import { descend } from '../internal/descend.js';
import { type Definition } from './Definition.js';
import { ObjectDefinition } from './ObjectDefinition.js';
import { PropertyDefinition } from './PropertyDefinition.js';

export class MapObjectDefinition<TValue> extends ObjectDefinition<
    Record<string, TValue>
> {
    constructor(entryDefinition: Definition<TValue>) {
        super();
        this.entryDefinition = new PropertyDefinition(entryDefinition);
    }

    readonly entryDefinition: PropertyDefinition<TValue>;

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
                !this.entryDefinition.type.doMatches(
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
        return `Record<string, ${this.entryDefinition.type.doToTypeString(
            descend(depth)
        )}>`;
    }

    public override getPropertyDefinition<Key extends string>(
        key: Key
    ): PropertyDefinition<TValue> | null {
        return this.entryDefinition;
    }

    public override getExpandoTypeDefinition(): Definition<TValue> | undefined {
        return this.entryDefinition.type;
    }
}
