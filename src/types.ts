import { type Model } from './models/Model'

export type TypeFromModel<TModel> = TModel extends Model<infer T> ? T : TModel
