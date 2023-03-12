import { type Definition } from '../../definitions/Definition.js';
import { type ModelFactory } from '../ModelFactory.js';
import { ModelImpl } from './ModelImpl.js';

export class SimpleModelImpl<
    T,
    TDef extends Definition<T>,
    TType extends string
> extends ModelImpl<T, TDef> {
    constructor(
        type: TType,
        value: T,
        definition: TDef,
        depth: number,
        factory: ModelFactory
    ) {
        super(value, definition, depth, factory);

        this.type = type;
    }

    readonly type: TType;
}
