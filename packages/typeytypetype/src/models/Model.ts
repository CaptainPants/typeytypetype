import { Definition } from '../definitions/Definition';
import { descend } from '../internal/descend';
import { createModel } from './createModel';

export type ModelForObjectProperty<T, TKey> = TKey extends keyof T
    ? Model<T[TKey]>
    : Model<unknown> | undefined;

export type ModelForElement<T> = T extends ReadonlyArray<infer S>
    ? Model<S>
    : undefined;

export class Model<T> {
    constructor(
        value: T,
        definition: Definition<T>,
        replaced: (newValue: T) => Promise<void>,
        depth: number
    ) {
        this.#value = value;
        this.#definition = definition;
        this.#replaced = replaced;
        this.#depth = depth;
    }

    #value: T;
    #definition: Definition<T>;
    #replaced: (newValue: T) => Promise<void>;
    #depth: number;

    get value(): T {
        return this.#value;
    }

    get definition(): Definition<T> {
        return this.#definition;
    }

    get replaced(): (newValue: T) => Promise<void> {
        return this.#replaced;
    }

    element(index: number): Model<unknown> | undefined {
        if (!Array.isArray(this.value)) {
            return undefined;
        }

        const element = this.value[index];

        const definition = this.definition.arrayElementDefinition(element);
        if (definition === undefined) {
            throw new TypeError('Unexpected');
        }

        return createModel(
            element,
            definition,
            async () => {},
            descend(this.#depth)
        );
    }

    property(key: string): Model<unknown> | undefined {
        if (typeof this.value !== 'object' || this.value === null) {
            return undefined;
        }

        const propertyValue = (this.value as Record<string, unknown>)[key];
        const def = this.definition.fixedPropertyDefinition(key);
        if (def === undefined) {
            throw new TypeError('Unexpected.');
        }

        return createModel(
            propertyValue,
            def,
            async () => {},
            descend(this.#depth)
        );
    }
}
