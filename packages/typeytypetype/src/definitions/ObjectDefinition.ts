import { combineDefinitionPath } from '../internal/combineDefinitionPath.js';
import { descend } from '../internal/descend.js';
import { type ExpandoType } from '../internal/utilityTypes.js';
import { BaseDefinition } from './BaseDefinition.js';
import { type Definition } from './Definition.js';
import {
    type ValidationSingleResult,
    type ValidationOptions,
} from '../validation/types.js';
import { type PropertyDefinition } from './PropertyDefinition.js';

export abstract class ObjectDefinition<
    TObject extends Record<string, unknown>
> extends BaseDefinition<TObject> {
    public getFixedPropertyNames(): string[] {
        return [];
    }

    public abstract getPropertyDefinition<Key extends string>(
        key: Key
    ): PropertyDefinition<TObject[Key]> | null;

    public getExpandoTypeDefinition():
        | Definition<ExpandoType<TObject>>
        | undefined {
        return undefined;
    }

    public supportsDelete(): boolean {
        return false;
    }

    protected override async doValidateChildren(
        value: TObject,
        options: ValidationOptions,
        depth: number
    ): Promise<ValidationSingleResult[] | undefined> {
        const keys = Object.keys(value);

        const res: ValidationSingleResult[] = [];

        for (const key of keys) {
            const propValue = value[key];
            const propDefinition = this.getPropertyDefinition(key);

            const currentPropValidationResult =
                await propDefinition?.type.doValidate(
                    propValue,
                    options,
                    descend(depth)
                );

            if (currentPropValidationResult !== undefined) {
                res.push(
                    ...currentPropValidationResult.map((item) => ({
                        path: combineDefinitionPath(key, item.path),
                        message: item.message,
                    }))
                );
            }
        }

        return res;
    }
}
