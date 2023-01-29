import { Definition } from '../definitions/Definition';
import { ObjectDefinition } from '../definitions/ObjectDefinition';
import { descend } from '../internal/descend';
import { Lazy } from '../Lazy';
import { Replacer } from '../types';
import { Model } from './Model';
import { ModelFactory } from './ModelFactory';

export class ObjectModel<T extends Record<string, unknown>> extends Model<T> {
    constructor(
        value: T,
        definition: ObjectDefinition<T>,
        replace: Replacer<T>,
        depth: number,
        factory: ModelFactory
    ) {
        super(value, definition, replace, depth, factory);

        this.#propertyModels = {};

        for (const key of Object.keys(value)) {
            const item = new Lazy(() => {
                const res = definition.getDefinition(key);
                if (res === undefined) throw new TypeError('Unexpected');
                return factory.create(
                    value[key],
                    res,
                    async (newValue) => {
                        await replace({
                            ...value,
                            [key]: newValue,
                        });
                    },
                    descend(depth)
                );
            });
            this.#propertyModels[key] = item;
        }
    }

    #propertyModels: Record<string, Lazy<Model<unknown>>>;

    override fixedPropertyDefinition(
        key: string
    ): Definition<unknown> | undefined {
        return this.#propertyModels[key]?.value?.definition;
    }

    override getFixedProperty(key: string): Model<unknown> | undefined {
        return this.#propertyModels[key]?.value;
    }
}
