import { type Model } from "./Model";

export type TypeFromModel<TModel> = TModel extends Model<infer T> ? T : TModel;
