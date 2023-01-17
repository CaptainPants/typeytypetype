import { type Model } from "./Model";

export type TypeFromModel<TModel> = TModel extends Model<infer T> ? T : TModel;

export type MappedTypeFromModel<T> = {
  [TKey in keyof T]: TypeFromModel<T[TKey]>;
};

export type MappedModel<T> = {
  [TKey in keyof T]: Model<T[TKey]>;
};
