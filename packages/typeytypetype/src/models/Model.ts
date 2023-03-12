import { type ArrayDefinition } from '../definitions/ArrayDefinition.js';
import { type BooleanDefinition } from '../definitions/BooleanDefinition.js';
import {
    type BooleanConstantDefinition,
    type NullConstantDefinition,
    type NumberConstantDefinition,
    type StringConstantDefinition,
    type UndefinedConstantDefinition,
} from '../definitions/ConstantDefinition.js';
import { type Definition } from '../definitions/Definition.js';
import { type NumberDefinition } from '../definitions/NumberDefinition.js';
import { type ObjectDefinition } from '../definitions/ObjectDefinition.js';
import { type PropertyDefinition } from '../definitions/PropertyDefinition.js';
import { type StringDefinition } from '../definitions/StringDefinition.js';
import { type ExpandoType, type IsUnion } from '../internal/utilityTypes.js';

export type ModelType = 'unknown' | 'union' | 'object' | 'array' | 'simple';

export interface UnknownBaseModel<TUnknownType = unknown> {
    readonly unknownValue: TUnknownType;
    readonly unknownDefinition: Definition<unknown>;
}

export interface BaseModel<
    T,
    TDefinition extends Definition<T> = Definition<T>,
    TUnknownType = unknown
> extends UnknownBaseModel<TUnknownType> {
    readonly value: Readonly<T>;
    readonly definition: TDefinition;
}

export interface SimpleModel<
    T,
    TDefinition extends Definition<T>,
    TType extends string
> extends BaseModel<T, TDefinition> {
    readonly type: TType;
}

export interface StringConstantModel
    extends SimpleModel<string, StringConstantDefinition, 'string-constant'> {}
export interface StringModel
    extends SimpleModel<string, StringDefinition, 'string'> {}
export interface NumberConstantModel
    extends SimpleModel<number, NumberConstantDefinition, 'number-constant'> {}
export interface NumberModel
    extends SimpleModel<number, NumberDefinition, 'number'> {}
export interface BooleanConstantModel
    extends SimpleModel<
        boolean,
        BooleanConstantDefinition,
        'boolean-constant'
    > {}
export interface BooleanModel
    extends SimpleModel<boolean, BooleanDefinition, 'boolean'> {}

export interface NullModel
    extends SimpleModel<null, NullConstantDefinition, 'null'> {}
export interface UndefinedModel
    extends SimpleModel<undefined, UndefinedConstantDefinition, 'undefined'> {}

export interface UnknownArrayModel extends UnknownBaseModel<unknown[]> {
    type: 'array';

    unknownElementDefinition: () => Definition<unknown>;

    unknownGetElement: (index: number) => Model<unknown> | undefined;

    unknownSpliceElements: (
        start: number,
        deleteCount: number,
        newElements: unknown[]
    ) => Promise<UnknownArrayModel>;
}

export interface ArrayModel<TElement>
    extends BaseModel<TElement[], ArrayDefinition<TElement>, unknown[]>,
        UnknownArrayModel {
    elementDefinition: () => Definition<TElement>;

    getElement: (index: number) => Model<TElement> | undefined;

    spliceElements: (
        start: number,
        deleteCount: number,
        newElements: TElement[]
    ) => Promise<Model<TElement[]>>;
}

export interface UnknownObjectModel
    extends UnknownBaseModel<Record<string, unknown>> {
    type: 'object';

    unknownExpandoPropertyDefinition: () => Definition<unknown> | undefined;

    unknownGetProperty: (key: string) => PropertyModel<unknown> | undefined;

    unknownSetPropertyValue: (
        key: string,
        value: unknown
    ) => Promise<Model<unknown>>;

    unknownDeleteProperty: (key: string) => Promise<Model<unknown>>;
}

export interface ObjectModel<TObject extends Record<string, unknown>>
    extends BaseModel<
            TObject,
            ObjectDefinition<TObject>,
            Record<string, unknown>
        >,
        UnknownObjectModel {
    expandoPropertyDefinition?: () =>
        | Definition<ExpandoType<TObject>>
        | undefined;

    getProperty: <TKey extends keyof TObject & string>(
        key: TKey
    ) => PropertyModel<TObject[TKey]>;

    setPropertyValue: <TKey extends keyof TObject & string>(
        key: TKey,
        value: TObject[TKey]
    ) => Promise<Model<TObject>>;

    deleteProperty: <TKey extends keyof TObject & string>(
        key: TKey
    ) => Promise<Model<TObject>>;
}

export interface UnknownUnionModel extends UnknownBaseModel {
    type: 'union';

    as: <TAs>(definition: Definition<TAs>) => Model<TAs> | null;

    unknownReplace: (value: unknown) => Promise<Model<unknown>>;
}

export interface UnionModel<TUnion>
    extends BaseModel<TUnion>,
        UnknownUnionModel {
    readonly resolved: SpreadModel<TUnion>;

    replace: (value: TUnion) => Promise<Model<TUnion>>;
}

export type SpreadModel<T> = T extends any ? Model<T> : never;

type SimpleModels<T> = T extends string
    ? T extends string
        ? StringModel
        : StringConstantModel
    : T extends number
    ? T extends number
        ? NumberModel
        : NumberConstantModel
    : T extends boolean
    ? T extends string
        ? StringModel
        : BooleanConstantModel
    : never;

export type UnknownModel =
    | UnknownArrayModel
    | UnknownObjectModel
    | UnknownUnionModel
    | StringModel
    | StringConstantModel
    | NumberModel
    | NumberConstantModel
    | BooleanModel
    | BooleanConstantModel
    | NullModel
    | UndefinedModel;

export type Model<T> = IsUnion<T> extends true
    ? UnionModel<T>
    : T extends Array<infer TElement>
    ? ArrayModel<TElement>
    : T extends Record<string, unknown>
    ? ObjectModel<T>
    : T extends string | number | boolean | null | undefined
    ? SimpleModels<T>
    : UnknownModel;
export interface PropertyModel<TType> {
    readonly name: string;
    readonly definition: PropertyDefinition<TType>;
    readonly valueModel: Model<TType>;
}
