import { type BaseDefinition } from '../../definitions/BaseDefinition.js';
import { ModelImpl } from './ModelImpl.js';

export class SimpleModelImpl<
    T,
    TDef extends BaseDefinition<T> = BaseDefinition<T>
> extends ModelImpl<T, TDef> {
    readonly type = 'simple';
}
