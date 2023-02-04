import * as assert from 'typed-assert';
import { ArrayDefinition } from '../definitions/ArrayDefinition';
import { Definition } from '../definitions/Definition';
import { ObjectDefinition } from '../definitions/ObjectDefinition';
import { UnionDefinition } from '../definitions/UnionDefinition';
import { descend } from '../internal/descend';
import { Model, ModelCommon } from './Model';
import { ModelFactoryArgs } from './ModelFactory';

export class StandardModelFactory {
    create<T>(args: ModelFactoryArgs<T>): Model<T> {
        let definition: Definition<T>;
        if (args.definition instanceof UnionDefinition) {
            const match = args.definition.getDefinition(args.value);
            if (match === undefined) {
                throw new Error(
                    `Could not find matching definition for value.`
                );
            }
            definition = match;
        } else {
            definition = args.definition;
        }

        const model: ModelCommon<T, Definition<T>> = {
            value: args.value,
            definition,
            originalDefinition: args.definition,
        };

        if (args.definition instanceof ArrayDefinition) {
            const typedDefinition = args.definition;
            const typedValue = args.value as unknown[];
            const elementDefinition = typedDefinition.getElementDefinition();

            const elementModels = typedValue.map((item) =>
                this.create({
                    value: item,
                    definition: elementDefinition,
                    depth: descend(args.depth),
                })
            );

            Object.defineProperties(model, {
                elementDefinition: {
                    configurable: false,
                    enumerable: true,
                    writable: false,
                    value: (): Definition<unknown> =>
                        typedDefinition.getElementDefinition(),
                },
                getElement: {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: (index: number): unknown => elementModels[index],
                },
                spliceElements: {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: (
                        start: number,
                        deleteCount: number,
                        items: unknown[]
                    ): unknown[] => {
                        const copy = [...typedValue];
                        copy.splice(start, deleteCount, ...items);
                        return copy;
                    },
                },
            });
        }

        if (args.definition instanceof ObjectDefinition) {
            const typedDefinition = args.definition;
            const typedValue = args.value as Record<string, unknown>;

            const fixedProperties = typedDefinition.getFixedPropertyNames();
            const fixedPropertyDefinitionModels: Record<
                string,
                Model<unknown>
            > = {};

            for (const name of fixedProperties) {
                const propertyDef = typedDefinition.getDefinition(name);
                assert.isNotUndefined(propertyDef);

                fixedPropertyDefinitionModels[name] = this.create({
                    value: typedValue[name],
                    definition: propertyDef,
                    depth: descend(args.depth),
                });
            }

            Object.defineProperties(model, {
                getFixedProperty: {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: (key: string) => fixedPropertyDefinitionModels[key],
                },
                setFixedProperty: {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: (key: string, value: unknown) => {
                        const prop = fixedPropertyDefinitionModels[key];
                        if (prop === undefined)
                            throw new Error(`No property ${key} found.`);
                        typedValue[key] = value;
                    },
                },
                expandoPropertyDefinition: {
                    configurable: false,
                    enumerable: true,
                    writable: false,
                    value: () => typedDefinition.getExpandoDefinition(),
                },
                getExpandoProperty: {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: (key: string) => {
                        if (fixedPropertyDefinitionModels[key] !== undefined)
                            throw new Error(
                                `Cannot get expando property for fixed property (Key: ${key}).`
                            );
                    },
                },
                setExpandoProperty: {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: async (key: string, value: unknown) => {
                        if (fixedPropertyDefinitionModels[key] !== undefined)
                            throw new Error(
                                `Cannot set expando property for fixed propertiy (Key: ${key}).`
                            );

                        const newValue = {
                            ...typedValue,
                            [key]: value,
                        };

                        return newValue;
                    },
                },
            });
        }

        return model as any;
    }

    static readonly defaultMaxDepth = 25;
}
