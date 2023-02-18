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
} from '../Model.js';
import { type ModelFactory } from '../ModelFactory.js';
import { ModelImpl } from './ModelImpl.js';

export class ObjectModelImpl<TObject extends Record<string, unknown>>
    extends ModelImpl<TObject, ObjectDefinition<TObject>>
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
            const propertyDef = definition.getDefinition(name);

            if (propertyDef === undefined) {
                throw new Error(
                    `Unexpected value found at key ${name} when no expando definition provided.`
                );
            }

            this.#propertyModels[name] = factory.create({
                parent: {
                    type: 'property',
                    model: this as any,
                    property: name,
                },
                value: value[name],
                definition: propertyDef as any,
                depth: descend(depth),
            });
        }
    }

    readonly type = 'object';

    #propertyModels: Record<string, Model<unknown>>;

    unknownExpandoPropertyDefinition(): Definition<unknown> | undefined {
        return this.expandoPropertyDefinition();
    }

    expandoPropertyDefinition(): Definition<ExpandoType<TObject>> | undefined {
        return this.definition.getExpandoDefinition();
    }

    unknownGetProperty<TKey extends string>(key: TKey): UnknownModel {
        return this.getProperty(key);
    }

    getProperty<TKey extends string>(key: TKey): Model<TObject[TKey]> {
        const result = this.#propertyModels[key];
        assert.isNotUndefined(result);
        return result as any;
    }

    async unknownSetPropertyValue<TKey extends string>(
        key: TKey,
        value: unknown
    ): Promise<UnknownModel> {
        const copy = {
            ...this.value,
            [key]: value,
        };

        if (!this.definition.matches(copy)) {
            throw new TypeError(`Invalid property assignment.`);
        }

        return this.factory.create<TObject>({
            parent: this.parent,
            value: copy,
            definition: this.definition,
            depth: this.depth,
        });
    }

    async setPropertyValue<TKey extends string>(
        key: TKey,
        value: TObject[TKey]
    ): Promise<Model<TObject>> {
        const copy = {
            ...this.value,
            [key]: value,
        };

        return this.factory.create<TObject>({
            parent: this.parent,
            value: copy,
            definition: this.definition,
            depth: this.depth,
        });
    }

    async unknownDeleteProperty(key: string): Promise<UnknownModel> {
        return await this.deleteProperty(key);
    }

    async deleteProperty<TKey extends string>(
        key: TKey
    ): Promise<Model<TObject>> {
        if (!this.definition.supportsDelete()) {
            throw new TypeError('Delete not supported.');
        }

        const copy = { ...this.value };
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete copy[key];

        return this.factory.create<TObject>({
            parent: this.parent,
            value: copy,
            definition: this.definition,
            depth: this.depth,
        });
    }
}
