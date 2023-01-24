import { Definition } from '../definitions/Definition';

type KeysIfObject<T> = T extends object ? keyof T : never;

type ElementType<T> = T extends ReadonlyArray<infer U> ? Definition<U> : never;

export interface Model<T> {
    value: T;
    definition: Definition<T>;

    element: () => ElementType<T>;
    property: <TKey extends KeysIfObject<T>>(key: TKey) => Model<T[TKey]>;
};

// type X = Model<string>;
// type Y = Model<string[]>;
// type ZZZ = Model<{ test: 1 }>;
// let x : ZZZ;
// x.property('test');
