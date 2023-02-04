import * as assert from 'typed-assert';
import { Definition } from "../../definitions/Definition";
import { ObjectDefinition } from "../../definitions/ObjectDefinition";
import { descend } from "../../internal/descend";
import { Model, ObjectModelParts } from "../Model";
import { ModelFactory } from "../ModelFactory";
import { ModelImpl } from "./ModelImpl";
import { FixedPropertyType, ExpandoPropertyType } from "./types";

export class ObjectModelImpl<T extends Record<string, unknown>> extends ModelImpl<T, ObjectDefinition<T>> implements ObjectModelParts<T>{
    constructor(value: T, definition: ObjectDefinition<T>, originalDefinition: Definition<T>, depth: number, factory: ModelFactory) {
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

    getFixedProperty<TKey extends string>(key: TKey): Model<FixedPropertyType<T, TKey>> {
        const result = this.#fixedPropertyDefinitionModels[key];
        assert.isNotUndefined(result);
        return result as any;
    }
    
    async setFixedProperty<TKey extends string>(key: TKey, value: FixedPropertyType<T, TKey>): Promise<Model<T>>{
        const prop = this.#fixedPropertyDefinitionModels[key];
        if (prop === undefined)
            throw new Error(`No property ${key} found.`);

        const copy = {
            ...this.value,
            [key]: value
        };
        return new ObjectModelImpl<T>(
            copy,
            this.definition,
            this.originalDefinition,
            this.depth,
            this.factory
        ) as any;
    }
    
    expandoPropertyDefinition(): Definition<ExpandoPropertyType<T>> | undefined{
        return this.definition.getExpandoDefinition();
    }
    
    getExpandoProperty(key: string): Model<ExpandoPropertyType<T>> | undefined{
        if (this.#fixedPropertyDefinitionModels[key] !== undefined) {
            throw new Error(
                `Cannot get expando property for fixed property (Key: ${key}).`
            );
        }

        const definition = this.definition.getExpandoDefinition();
        if (definition === undefined){
            throw new Error('Expando properties not allowed.');
        }

        return this.factory.create({
            value: this.value[key],
            definition,
            depth: descend(this.depth)
        }) as any;
    }
    
    async setExpandoProperty(key: string, value: ExpandoPropertyType<T>): Promise<Model<T>>{
        const prop = this.#fixedPropertyDefinitionModels[key];
        if (prop === undefined)
            throw new Error(`No property ${key} found.`);

        const copy = {
            ...this.value,
            [key]: value
        };
        return new ObjectModelImpl<T>(
            copy,
            this.definition,
            this.originalDefinition,
            this.depth,
            this.factory
        ) as any;
    }

    async deleteExpandoProperty(key: string, value: ExpandoPropertyType<T>): Promise<Model<T>>{
        const prop = this.#fixedPropertyDefinitionModels[key];
        if (prop === undefined)
            throw new Error(`No property ${key} found.`);

        const copy = {
            ...this.value,
        };
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete copy[key];
        return new ObjectModelImpl<T>(
            copy,
            this.definition,
            this.originalDefinition,
            this.depth,
            this.factory
        ) as any;
    }
}