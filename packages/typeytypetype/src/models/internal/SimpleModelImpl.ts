import { type Definition } from '../../definitions/Definition.js';
import { ModelImpl } from './ModelImpl.js';

export class SimpleModelImpl<
    T,
    TDef extends Definition<T> = Definition<T>
> extends ModelImpl<T, TDef> {
    readonly type = 'simple';
}
