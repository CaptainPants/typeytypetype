import { combineDefinitionPath } from '../internal/combineDefinitionPath.js';
import { descend } from '../internal/descend.js';
import { type ExpandoType } from '../internal/utilityTypes.js';
import { BaseDefinition } from './BaseDefinition.js';
import { type Definition } from './Definition.js';
import { type ValidationOptions } from './Validator.js';

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

    protected override async doValidateChildren(
        value: TObject,
        { deep, path }: ValidationOptions,
        depth: number
    ): Promise<string[] | undefined> {
        const keys = Object.keys(value);

        const res: string[] = [];

        for (const key of keys) {
            const propValue = value[key];
            const propDefinition = this.getDefinition(key);

            const currentPropValidationResult =
                await propDefinition?.doValidate(
                    propValue,
                    { deep, path: combineDefinitionPath(path, key) },
                    descend(depth)
                );

            if (currentPropValidationResult !== undefined) {
                res.push(...currentPropValidationResult);
            }
        }

        return res;
    }
}
