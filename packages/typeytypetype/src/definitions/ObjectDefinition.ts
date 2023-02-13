import { type FixedPropertyType } from '../models/internal/types.js';
import { BaseDefinition } from './BaseDefinition.js';
import { type Definition } from './Definition.js';

export abstract class ObjectDefinition<
    TObject extends Record<string, unknown>
> extends BaseDefinition<TObject> {
    public getFixedPropertyNames(): string[] {
        return [];
    }

    public abstract getDefinition<Key extends string>(
        key: Key
    ): Definition<FixedPropertyType<TObject, Key>> | undefined;

    public getExpandoDefinition(): Definition<unknown> | undefined {
        return undefined;
    }

    public supportsDelete(): boolean {
        return false;
    }
}
