import { type Definition } from './definitions/Definition.js';

export type TypeFromModel<TModel> = TModel extends Definition<infer T>
    ? T
    : TModel;
