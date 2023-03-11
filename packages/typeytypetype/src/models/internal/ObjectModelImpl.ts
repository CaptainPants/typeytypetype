import * as assert from 'typed-assert';
import { type Definition } from '../../definitions/Definition.js';
import { type ObjectDefinition } from '../../definitions/ObjectDefinition.js';
import { descend } from '../../internal/descend.js';
import { type ExpandoType } from '../../internal/utilityTypes.js';
import {
    type ParentRelationship,
    type Model,
    type ObjectModel,
    type UnknownModel,
    type PropertyModel,
} from '../Model.js';
import { type ModelFactory } from '../ModelFactory.js';
import { validateForAdoption } from './validateForAdoption.js';
import { ModelImpl } from './ModelImpl.js';
import { PropertyModelImpl } from './PropertyModelImpl.js';

export class ObjectModelImpl<TObject extends Record<string, unknown>>
    extends ModelImpl<
        TObject,
        ObjectDefinition<TObject>,
        Record<string, unknown>
    >
    implements ObjectModel<TObject>
{
    constructor(
        parent: ParentRelationship | null,
        value: TObject,
        definition: ObjectDefinition<TObject>,
        depth: number,
        factory: ModelFactory
    ) {
        super(parent, value, definition, depth, factory);

        this.#propertyModels = {};

        for (const name of Object.keys(value)) {
            const propertyDef = definition.getPropertyDefinition(name);

            if (propertyDef === null) {
                throw new Error(
                    `Unexpected value found at key ${name} when no expando definition provided.`
                );
            }

            const propertyValueModel = factory.createUnvalidatedModelPart({
                parent: {
                    type: 'property',
                    model: this as any,
                    property: name,
                },
                value: value[name],
                definition: propertyDef.type,
                depth: descend(depth),
            });

            this.#propertyModels[name] = new PropertyModelImpl<any>(
                name,
                propertyDef,
                propertyValueModel
            );
        }
    }

    readonly type = 'object';

    #propertyModels: Record<string, PropertyModel<unknown>>;

    unknownExpandoPropertyDefinition(): Definition<unknown> | undefined {
        return this.expandoPropertyDefinition();
    }

    expandoPropertyDefinition(): Definition<ExpandoType<TObject>> | undefined {
        return this.definition.getExpandoTypeDefinition();
    }

    unknownGetProperty(key: string): PropertyModel<unknown> | undefined {
        const result = this.#propertyModels[key];
        return result;
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
        const def = this.definition.getPropertyDefinition(key);

        if (def === null) {
            throw new TypeError(
                `Could not assign to property ${key} as no definition found.`
            );
        }

        const adopted = await validateForAdoption(value, def.type);

        const copy = {
            ...this.value,
            [key]: adopted,
        };

        await this.definition.validateAndThrow(copy, { deep: false });

        return this.factory.createUnvalidatedModelPart<TObject>({
            parent: this.parent,
            value: copy,
            definition: this.definition,
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
        if (!this.definition.supportsDelete()) {
            throw new TypeError('Delete not supported.');
        }

        const copy = { ...this.value };
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete copy[key];

        return this.factory.createUnvalidatedModelPart<TObject>({
            parent: this.parent,
            value: copy,
            definition: this.definition,
            depth: this.depth,
        });
    }

    async deleteProperty<TKey extends keyof TObject & string>(
        key: TKey
    ): Promise<Model<TObject>> {
        return (await this.unknownDeleteProperty(key)) as Model<TObject>;
    }
}
