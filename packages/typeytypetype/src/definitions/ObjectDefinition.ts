import { FixedPropertyType } from '../models/internal/types.js';
import { Definition } from './Definition.js';

export abstract class ObjectDefinition<
    TObject extends Record<string, unknown>
> extends Definition<TObject> {
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
