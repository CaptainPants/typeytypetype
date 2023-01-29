import { Definition } from '../definitions/Definition';
import { descend } from '../internal/descend';
import { ModelArchetype, Replacer } from '../types';
import { createModel, ModelFactory } from './ModelFactory';

export type ModelForObjectProperty<T, TKey> = TKey extends keyof T
    ? Model<T[TKey]>
    : Model<unknown> | undefined;

export type ModelForElement<T> = T extends ReadonlyArray<infer S>
    ? Model<S>
    : undefined;

export abstract class Model<T> {
    constructor(
        value: T,
        definition: Definition<T>,
        replace: Replacer<T>,
        depth: number,
        factory: ModelFactory
    ) {
        this.#value = value;
        this.#definition = definition;
        this.#replace = replace;
        this.#depth = depth;
        this.#factory = factory;
    }

    #value: T;
    #definition: Definition<T>;
    #replace: Replacer<T>;
    #depth: number;
    #factory: ModelFactory;

    get value(): T {
        return this.#value;
    }

    get type(): ModelArchetype;

    get definition(): Definition<T> {
        return this.#definition;
    }

    get replace(): (newValue: T) => Promise<void> {
        return this.#replace;
    }

    get depth(): number {
        return this.#depth;
    }

    get factory(): ModelFactory {
        return this.#factory;
    }

    elementDefinition(): Definition<unknown> | undefined {
        return undefined;
    }

    getElement(index: number): Model<unknown> | undefined {
        return undefined;
    }

    async spliceElements(
        index: number,
        removeCount: number,
        newElements: unknown[]
    ): Promise<void> {
        throw new TypeError('Not supported');
    }

    expandoPropertyDefinition(): Definition<unknown> | undefined {
        return undefined;
    }

    getExpandoProperty(key: string): Model<unknown> | undefined {
        return undefined;
    }

    async setExpandoProperty(key: string, value: unknown): Promise<void> {
        throw new TypeError('Not supported');
    }

    async deleteExpandoProperty(key: stringn): Promise<void> {
        throw new TypeError('Not supported');
    }

    fixedPropertyDefinition(key: string): Definition<unknown> | undefined {
        return undefined;
    }

    getFixedProperty(key: string): Model<unknown> | undefined {
        return undefined;
    }
}
