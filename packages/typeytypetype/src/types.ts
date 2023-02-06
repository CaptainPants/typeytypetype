import { type Definition } from './definitions/Definition.js';

export type TypeFromDefinition<TModel> = TModel extends Definition<infer T>
    ? T
    : TModel;

export type Replacer<T> = (value: T) => Promise<void>;

export type ElementType<T, Fallback = never> = T extends Array<infer S>
    ? S
    : Fallback;

export type ExpandoType<T extends Record<string, unknown>> = {
    [Key in keyof T]: string extends Key ? T[Key] : never;
}[keyof T];

export type FixedProperties<T extends Record<string, unknown>> = {
    [Key in keyof T as string extends Key ? never : Key]: T[Key];
};

export type FixedAndExpando<
    TFixed extends Record<string, unknown>,
    TExpando
> = TFixed &
    // Hack as TType extends never distributes across 'never' which is an empty set
    // this seems to avoid that issue
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    ({ test: TExpando } extends { test: never }
        ? unknown
        : { [key: string]: TExpando });

export type IdentityMap<T> = { [Key in keyof T]: T[Key] };
