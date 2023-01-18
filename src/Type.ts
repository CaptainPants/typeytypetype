import {
  MappedTypeFromModel,
  TupleToIntersection,
} from "./internal/utilityTypes";
import {
  ArrayModel,
  BooleanrTypeModel,
  ConstantModel,
  Model,
  NumberTypeModel,
  StringTypeModel,
} from "./Model";
import { TypeFromModel } from "./types";

export namespace Type {
  export function value<TValue extends string | number | boolean | null>(
    value: TValue
  ): ConstantModel<TValue> {
    return new ConstantModel(value);
  }

  export function absent(): Model<undefined> {
    return new ConstantModel(undefined);
  }

  export function string(): StringTypeModel<string> {
    return new StringTypeModel();
  }

  export function boolean(): BooleanTypeModel<boolean> {
    return new BooleanTypeModel();
  }

  export function number(): NumberTypeModel<number> {
    return new NumberTypeModel();
  }

  export function union<TModelArray extends readonly Model<unknown>[]>(
    ...models: TModelArray
  ): Model<MappedTypeFromModel<TModelArray>[number]> {
    throw "Not implemented";
  }

  export function intersect<TModelArray extends readonly Model<unknown>[]>(
    ...models: TModelArray
  ): Model<TupleToIntersection<MappedTypeFromModel<TModelArray>>> {
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

  export function array<IElementType>(
    itemModel: Model<IElementType>
  ): ArrayModel<IElementType> {
    return new ArrayModel(itemModel);
  }
}
