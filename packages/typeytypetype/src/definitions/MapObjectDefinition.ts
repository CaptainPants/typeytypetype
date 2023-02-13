import { descend } from '../internal/descend.js';
import { type FixedPropertyType } from '../models/internal/types.js';
import { type BaseDefinition } from './BaseDefinition.js';
import { ObjectDefinition } from './ObjectDefinition.js';

export class MapObjectDefinition<TValue> extends ObjectDefinition<
    Record<string, TValue>
> {
    constructor(propertyDefinition: BaseDefinition<TValue>) {
        super();
        this.propertyDefinition = propertyDefinition;
    }

    readonly propertyDefinition: BaseDefinition<TValue>;

    override doMatches(
        value: unknown,
        depth: number
    ): value is Record<string, TValue> {
        if (typeof value !== 'object' || value === null) return false;

        const asRecord = value as Record<string, unknown>;

        // Looking for validation failures
        const inputPropertyFailures = Object.keys(value).findIndex((key) => {
            const property = (value as Record<string, unknown>)[key];
            if (typeof property === 'undefined') return true; // this shouldn't happen

            const propertyValue = asRecord[key];
            if (
                !this.propertyDefinition.doMatches(
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
        return `Record<string, ${this.propertyDefinition.doToTypeString(
            descend(depth)
        )}>`;
    }

    public override getDefinition<Key extends string>(
        key: Key
    ):
        | BaseDefinition<FixedPropertyType<Record<string, TValue>, Key>>
        | undefined {
        return this.propertyDefinition as any;
    }
}
