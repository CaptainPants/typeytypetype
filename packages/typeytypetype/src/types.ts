import { type Definition } from './definitions/Definition.js';

export type TypeFromDefinition<TModel> = TModel extends Definition<infer T>
    ? T
    : TModel;
