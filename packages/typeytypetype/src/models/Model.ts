import { Definition } from '../definitions/Definition';
import { ElementType, Replacer } from '../types';

export interface Model<T, TDef extends Definition<T> = Definition<T>> {
    get value(): T;

    get definition(): TDef;

    get replace(): (newValue: T) => Promise<void>;

    elementDefinition: () => Definition<ElementType<T>> | undefined;

    getElement: (index: number) => Model<ElementType<T>> | undefined;

    spliceElements: (
        index: number,
        removeCount: number,
        newElements: Array<ElementType<T>>
    ) => Promise<void>;

    expandoPropertyDefinition: () => Definition<unknown> | undefined;

    getExpandoProperty: (key: string) => Model<unknown> | undefined;

    setExpandoProperty: (key: string, value: unknown) => Promise<void>;

    deleteExpandoProperty: (key: string) => Promise<void>;

    fixedPropertyDefinition: (key: string) => Definition<unknown> | undefined;

    getFixedProperty: (key: string) => Model<unknown> | undefined;

    clone: (replace: Replacer<T>) => Model<T, TDef>;
}
