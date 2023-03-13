import * as assert from 'typed-assert';
import { type Type } from '../../types/Type.js';
import { type ObjectType } from '../../types/ObjectType.js';
import { descend } from '../../internal/descend.js';
import { type ExpandoType } from '../../internal/utilityTypes.js';
import { type Model, type ObjectModel, type UnknownModel } from '../Model.js';
import { type ModelFactory } from '../ModelFactory.js';
import { validateForAdoption } from './validateForAdoption.js';
import { ModelImpl } from './ModelImpl.js';
import { PropertyModelImpl } from './PropertyModelImpl.js';
import { type PropertyModel } from '../PropertyModel.js';

export class ObjectModelImpl<TObject extends Record<string, unknown>>
    extends ModelImpl<TObject, ObjectType<TObject>, Record<string, unknown>>
    implements ObjectModel<TObject>
{
    constructor(
        value: TObject,
        type: ObjectType<TObject>,
        depth: number,
        factory: ModelFactory
    ) {
        super(value, type, depth, factory);

        this.#propertyModels = {};

        for (const name of Object.keys(value)) {
            const propertyDef = type.getPropertyDefinition(name);

            if (propertyDef === null) {
                throw new Error(
                    `Unexpected value found at key ${name} when no expando type provided.`
                );
            }

            const propertyValueModel = factory.createUnvalidatedModelPart({
                value: value[name],
                type: propertyDef.type,
                depth: descend(depth),
            });

            this.#propertyModels[name] = new PropertyModelImpl<any>(
                name,
                propertyDef,
                propertyValueModel
            );
        }
    }

    readonly archetype = 'object';

    #propertyModels: Record<string, PropertyModel<unknown>>;

    unknownExpandoPropertyType(): Type<unknown> | undefined {
        return this.expandoPropertyType();
    }

    expandoPropertyType(): Type<ExpandoType<TObject>> | undefined {
        return this.type.getExpandoTypeDefinition();
    }

    unknownGetProperty(key: string): PropertyModel<unknown> | undefined {
        const result = this.#propertyModels[key];
        return result;
    }

    unknownGetProperties(): Array<PropertyModel<unknown>> {
        return Object.values(this.#propertyModels);
    }

    getProperty<TKey extends keyof TObject & string>(
        key: TKey
    ): PropertyModel<TObject[TKey]> {
        const result = this.#propertyModels[key];
        assert.isNotUndefined(result);
        return result as any;
    }

    async unknownSetPropertyValue(
        key: string,
        value: unknown
    ): Promise<UnknownModel> {
        const def = this.type.getPropertyDefinition(key);

        if (def === null) {
            throw new TypeError(
                `Could not assign to property ${key} as no type found.`
            );
        }

        const adopted = await validateForAdoption(value, def.type);

        const copy = {
            ...this.value,
            [key]: adopted,
        };

        await this.type.validateAndThrow(copy, { deep: false });

        return this.factory.createUnvalidatedModelPart<TObject>({
            value: copy,
            type: this.type,
            depth: this.depth,
        });
    }

    async setPropertyValue<TKey extends keyof TObject & string>(
        key: TKey,
        value: TObject[TKey]
    ): Promise<Model<TObject>> {
        return (await this.unknownSetPropertyValue(
            key,
            value
        )) as Model<TObject>;
    }

    async unknownDeleteProperty(key: string): Promise<UnknownModel> {
        if (!this.type.supportsDelete()) {
            throw new TypeError('Delete not supported.');
        }

        const copy = { ...this.value };
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete copy[key];

        return this.factory.createUnvalidatedModelPart<TObject>({
            value: copy,
            type: this.type,
            depth: this.depth,
        });
    }

    async deleteProperty<TKey extends keyof TObject & string>(
        key: TKey
    ): Promise<Model<TObject>> {
        return (await this.unknownDeleteProperty(key)) as Model<TObject>;
    }
}
