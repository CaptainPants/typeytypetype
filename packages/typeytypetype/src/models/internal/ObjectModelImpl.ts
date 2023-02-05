import * as assert from 'typed-assert';
import { Definition } from '../../definitions/Definition';
import { ObjectDefinition } from '../../definitions/ObjectDefinition';
import { descend } from '../../internal/descend';
import { Model, ObjectModelParts } from '../Model';
import { ModelFactory } from '../ModelFactory';
import { ModelImpl } from './ModelImpl';
import { FixedPropertyType } from './types';

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

        const fixedProperties = definition.getFixedPropertyNames();

        this.#fixedPropertyDefinitionModels = {};

        for (const name of fixedProperties) {
            const propertyDef = definition.getDefinition(name);
            assert.isNotUndefined(propertyDef);

            this.#fixedPropertyDefinitionModels[name] = factory.create({
                value: value[name],
                definition: propertyDef,
                depth: descend(depth),
            });
        }
    }

    #fixedPropertyDefinitionModels: Record<string, Model<unknown>>;

    getFixedProperty<TKey extends string>(
        key: TKey
    ): Model<FixedPropertyType<TObject, TKey>> {
        const result = this.#fixedPropertyDefinitionModels[key];
        assert.isNotUndefined(result);
        return result as any;
    }

    async setFixedProperty<TKey extends string>(
        key: TKey,
        value: FixedPropertyType<TObject, TKey>
    ): Promise<Model<TObject>> {
        const prop = this.#fixedPropertyDefinitionModels[key];
        if (prop === undefined) throw new Error(`No property ${key} found.`);

        const copy = {
            ...this.value,
            [key]: value,
        };
        return new ObjectModelImpl<TObject>(
            copy,
            this.definition,
            this.originalDefinition,
            this.depth,
            this.factory
        ) as any;
    }
}
