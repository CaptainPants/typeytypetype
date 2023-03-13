import { type Type } from '../../types/Type.js';
import { type BaseModel } from '../Model.js';
import { type ModelFactory } from '../ModelFactory.js';

export class ModelImpl<
    T,
    TTypeType extends Type<T> = Type<T>,
    TUnknownType = unknown
> implements BaseModel<T, TTypeType, TUnknownType>
{
    constructor(
        value: T,
        type: TTypeType,
        depth: number,
        factory: ModelFactory
    ) {
        this.value = value;
        this.type = type;
        this.depth = depth;
        this.factory = factory;
    }

    public readonly value: T;
    public readonly type: TTypeType;
    public readonly depth: number;
    public readonly factory: ModelFactory;

    public get unknownValue(): TUnknownType {
        return this.value as any;
    }

    public get unknownType(): Type<unknown> {
        return this.type;
    }
}
