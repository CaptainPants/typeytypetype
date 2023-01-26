import { Definition } from '../definitions/Definition';

type ModelForKey<T, TKey> = TKey extends keyof T
    ? Model<T[TKey]>
    : Model<unknown>;

type ElementType<T> = T extends ReadonlyArray<infer U>
    ? Definition<U>
    : undefined;

export class Model<T> {
    constructor(value: T, definition: Definition<T>) {
        this.#value = value;
        this.#definition = definition;
    }

    #value: T;
    #definition: Definition<T>;

    elements(): ElementType<T> {
        throw new Error();
    }

    property<TKey extends string>(key: TKey): ModelForKey<T, TKey> {
        throw new Error();
    }
}

// type X = Model<string>;
// type Y = Model<string[]>;
// type ZZZ = Model<{ test: 1 }>;
// let x : ZZZ;
// x.property('test');
