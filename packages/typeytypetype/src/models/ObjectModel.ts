import { Definition } from '../definitions/Definition';
import { ObjectDefinition } from '../definitions/ObjectDefinition';
import { descend } from '../internal/descend';
import { Replacer } from '../types';
import { Model } from './Model';
import { ModelBase } from './ModelBase';
import { ModelCreationArgs } from './types';

export class ObjectModel<T extends Record<string, unknown>> extends ModelBase<T, ObjectDefinition<T>> {
    constructor(args: ModelCreationArgs<T, ObjectDefinition<T>>) {
        super(args);

        this.#propertyModels = {};

        for (const key of Object.keys(this.value)) {
            const propertyDefinition = this.definition.getDefinition(key);

            if (propertyDefinition === undefined) throw new TypeError('Unexpected');

            const item = this.factory.create({
                value: this.value[key],
                definition: propertyDefinition,
                replace: async (newValue) => {
                    await this.replace({
                        ...this.value,
                        [key]: newValue,
                    });
                },
                depth: descend(this.depth)
            });

            this.#propertyModels[key] = item;
        }
    }

    #propertyModels: Record<string, Model<unknown>>;

    override fixedPropertyDefinition(
        key: string
    ): Definition<unknown> | undefined {
        return this.#propertyModels[key]?.definition;
    }

    override getFixedProperty(key: string): Model<unknown> | undefined {
        return this.#propertyModels[key];
    }

    override clone(replace: Replacer<T>): Model<T, ObjectDefinition<T>> {
        return new ObjectModel<T>({
            value: this.value, 
            definition: this.definition, 
            replace, 
            depth: this.depth, 
            factory: this.factory
        });
    }
}
