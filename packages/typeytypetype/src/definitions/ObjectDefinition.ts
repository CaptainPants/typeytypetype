import { type ExpandoType } from '../internal/utilityTypes.js';
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
    ): Definition<TObject[Key]> | null;

    public getExpandoDefinition():
        | Definition<ExpandoType<TObject>>
        | undefined {
        return undefined;
    }

    public supportsDelete(): boolean {
        return false;
    }
}
