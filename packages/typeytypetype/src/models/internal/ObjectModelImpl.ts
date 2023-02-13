import * as assert from 'typed-assert';
import { type BaseDefinition } from '../../definitions/BaseDefinition.js';
import { type ObjectDefinition } from '../../definitions/ObjectDefinition.js';
import { descend } from '../../internal/descend.js';
import { type Model, type ObjectModel } from '../Model.js';
import { type ModelFactory } from '../ModelFactory.js';
import { ModelImpl } from './ModelImpl.js';
import { type FixedPropertyType } from './types.js';

export class ObjectModelImpl<TObject extends Record<string, unknown>>
    extends ModelImpl<TObject, ObjectDefinition<TObject>>
    implements ObjectModel<TObject>
{
    constructor(
        value: TObject,
        definition: ObjectDefinition<TObject>,
        depth: number,
        factory: ModelFactory
    ) {
        super(value, definition, depth, factory);

        this.#propertyModels = {};

        for (const name of Object.keys(value)) {
            const propertyDef = definition.getDefinition(name);

            if (propertyDef === undefined) {
                throw new Error(
                    `Unexpected value found at key ${name} when no expando definition provided.`
                );
            }

            this.#propertyModels[name] = factory.create({
                value: value[name],
                definition: propertyDef as any,
                depth: descend(depth),
            });
        }
    }

    readonly type = 'object';

    #propertyModels: Record<string, Model<unknown>>;

    expandoPropertyDefinition(): BaseDefinition<unknown> | undefined {
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
        const copy = {
            ...this.value,
            [key]: value,
        };

        return this.factory.create<TObject>({
            value: copy,
            definition: this.definition,
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
