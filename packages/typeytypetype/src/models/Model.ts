import { Definition } from '../definitions/Definition';
import { ElementType, Replacer } from '../types';

export type ModelOfElementType<T> = T extends unknown[] ? Model<ElementType<T>> : undefined;
export type DefinitionOfElementType<T> = T extends unknown[] ? Definition<ElementType<T>> : undefined;

export interface Model<T, TDef extends Definition<T> = Definition<T>> {
    get value(): T;

    get definition(): TDef;

    get replace(): (newValue: T) => Promise<void>;

    elementDefinition: () => DefinitionOfElementType<T>;

    getElement: (index: number) => ModelOfElementType<T>| undefined;

    spliceElements: (
        index: number,
        removeCount: number,
        newElements: Array<ElementType<T, unknown>>
    ) => Promise<void>;

    expandoPropertyDefinition: () => Definition<unknown> | undefined;

    getExpandoProperty: (key: string) => Model<unknown> | undefined;

    setExpandoProperty: (key: string, value: unknown) => Promise<void>;

    deleteExpandoProperty: (key: string) => Promise<void>;

    fixedPropertyDefinition: (key: string) => Definition<unknown> | undefined;

    getFixedProperty: (key: string) => Model<unknown> | undefined;

    clone: (replace: Replacer<T>) => Model<T, TDef>;
}
