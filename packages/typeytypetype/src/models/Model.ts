import { Definition } from '../definitions/Definition';

type ObjectKeys<T> = T extends object ? keyof T : never;

export type Model<T> = {
    value: T;
    definition: Definition<T>;

    element: () => T extends unknown[] ? Definition<T[number]> : never;
    property: <TKey extends ObjectKeys<T>>(
        key: TKey
    ) => T[TKey];
};

type X = Model<string>;
type Y = Model<string[]>;
type ZZZ = Model<{ test: 1 }>;
