import { Definition } from '../definitions/Definition';

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
        replaced: (newValue: T) => Promise<void>
    ) {
        this.#value = value;
        this.#definition = definition;
        this.#replaced = replaced;
    }

    #value: T;
    #definition: Definition<T>;
    #replaced: (newValue: T) => Promise<void>;

    get value(): T {
        return this.#value;
    }

    get definition(): Definition<T> {
        return this.#definition;
    }

    get replaced(): (newValue: T) => Promise<void> {
        return this.#replaced;
    }

    abstract element(index: number): ModelForElement<T>;

    abstract property<TKey extends string>(
        key: TKey
    ): ModelForObjectProperty<T, TKey>;
}
