import { Model } from "./Model";
import { MappedTypeFromModel, TypeFromModel } from "./types";

type Intersect<TArgs extends readonly unknown[]> = TArgs extends [infer Only]
  ? Only
  : TArgs extends [infer First, ...infer Rest]
  ? First & Intersect<Rest>
  : never;

export namespace Type {
  export function value<TValue extends string | number | boolean | null>(
    value: TValue
  ): Model<TValue> {
    throw "Not implemented";
  }
  export function absent(): Model<undefined> {
    throw "Not implemented";
  }

  export function string(): Model<string> {
    throw "Not implemented";
  }

  export function boolean(): Model<boolean> {
    throw "Not implemented";
  }

  export function number(): Model<number> {
    throw "Not implemented";
  }

  export function union<TModelArray extends readonly Model<unknown>[]>(
    ...models: TModelArray
  ): Model<MappedTypeFromModel<TModelArray>[number]> {
    throw "Not implemented";
  }

  export function intersect<TModelArray extends readonly Model<unknown>[]>(
    ...models: TModelArray
  ): Model<Intersect<MappedTypeFromModel<TModelArray>>> {
    throw "Not implemented";
  }

  export function object<
    TPropertyModels extends Record<string, Model<unknown>>
  >(
    properties: TPropertyModels
  ): Model<{
    [K in keyof TPropertyModels]: TypeFromModel<TPropertyModels[K]>;
  }> {
    throw "Not implemented";
  }

  export function array<TModel extends Model<unknown>>(
    model: TModel
  ): Model<Array<TypeFromModel<TModel>>> {
    throw "Not implemented";
  }
}

//
