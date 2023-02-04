import { Definition } from '../definitions/Definition';
import { Model } from './Model';
import { ModelFactoryArgs } from './types';

export interface ModelFactory {
    create: <T, TDef extends Definition<T> = Definition<T>>(args: ModelFactoryArgs<T, TDef>) => Model<T, TDef>;
}
