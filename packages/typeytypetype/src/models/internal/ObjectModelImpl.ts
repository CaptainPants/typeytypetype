import * as assert from 'typed-assert';
import { Definition } from '../../definitions/Definition.js';
import { ObjectDefinition } from '../../definitions/ObjectDefinition.js';
import { descend } from '../../internal/descend.js';
import { Model, ObjectModelParts } from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { ModelImpl } from './ModelImpl.js';
import { FixedPropertyType } from './types.js';

export class ObjectModelImpl<TObject extends Record<string, unknown>>
    extends ModelImpl<TObject, ObjectDefinition<TObject>>
    implements ObjectModelParts<TObject>
{
    constructor(
        value: TObject,
        definition: ObjectDefinition<TObject>,
        originalDefinition: Definition<TObject>,
        depth: number,
        factory: ModelFactory
    ) {
        super(value, definition, originalDefinition, depth, factory);

        this.#propertyModels = {};

        // TODO: check for missing properties

        for (const name of Object.keys(value)) {
            const propertyDef = definition.getDefinition(name);

            if (propertyDef === undefined) {
                throw new Error(
                    `Unexpected value found at key ${name} when no expando definition provided.`
                );
            }

            this.#propertyModels[name] = factory.create({
                value: value[name],
                definition: propertyDef,
                depth: descend(depth),
            });
        }
    }

    #propertyModels: Record<string, Model<unknown>>;

    expandoPropertyDefinition(): Definition<unknown> | undefined {
        return this.definition.getExpandoDefinition();
    }

    getProperty<TKey extends string>(
        key: TKey
    ): Model<FixedPropertyType<TObject, TKey>> {
        const result = this.#propertyModels[key];
        assert.isNotUndefined(result);
        return result as any;
    }

    async setPropertyValue<TKey extends string>(
        key: TKey,
        value: FixedPropertyType<TObject, TKey>
    ): Promise<Model<TObject>> {
        const prop = this.#propertyModels[key];
        if (prop === undefined) throw new Error(`No property ${key} found.`);

        const copy = {
            ...this.value,
            [key]: value,
        };

        return this.factory.create<TObject>({
            value: copy,
            definition: this.originalDefinition,
            depth: this.depth,
        });
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
            value: copy,
            definition: this.definition,
            depth: this.depth,
        });
    }
}
