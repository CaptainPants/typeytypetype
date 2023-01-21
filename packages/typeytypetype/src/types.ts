import { type Model } from './models/Model.js';

export type TypeFromModel<TModel> = TModel extends Model<infer T> ? T : TModel;
