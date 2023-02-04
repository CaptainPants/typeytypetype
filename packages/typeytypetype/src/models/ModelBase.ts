import { Definition } from '../definitions/Definition';
import { ElementType, Replacer } from '../types';
import { DefinitionOfElementType, Model, ModelOfElementType } from './Model';
import { ModelFactory } from './ModelFactory';
import { ModelCreationArgs } from './types';

export abstract class ModelBase<T, TDef extends Definition<T> = Definition<T>> implements Model<T, TDef> {
    constructor(
        args: ModelCreationArgs<T, TDef>
    );
    constructor(
        { value, definition, replace, depth, factory }: ModelCreationArgs<T, TDef>
    ) {
        this.#value = value;
        this.#definition = definition;
        this.#replace = replace;
        this.#depth = depth;
        this.#factory = factory;
    }

    #value: T;
    #definition: TDef;
    #replace: Replacer<T>;
    #depth: number;
    #factory: ModelFactory;

    get value(): T {
        return this.#value;
    }

    get definition(): TDef {
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

    elementDefinition(): DefinitionOfElementType<T> {
        // @ts-expect-error -- We're cheating the type system slightly here
        return undefined;
    }

    getElement(index: number): ModelOfElementType<T> | undefined {
        return undefined;
    }

    async spliceElements(
        index: number,
        removeCount: number,
        newElements: Array<ElementType<T, unknown>>
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

    async deleteExpandoProperty(key: string): Promise<void> {
        throw new TypeError('Not supported');
    }

    fixedPropertyDefinition(key: string): Definition<unknown> | undefined {
        return undefined;
    }

    getFixedProperty(key: string): Model<unknown> | undefined {
        return undefined;
    }

    abstract clone(replace: Replacer<T>): Model<T, TDef>;
}
