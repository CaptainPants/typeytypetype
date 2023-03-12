import { type Definition } from '../../definitions/Definition.js';
import { type BaseModel } from '../Model.js';
import { type ModelFactory } from '../ModelFactory.js';

export class ModelImpl<
    T,
    TDefinition extends Definition<T> = Definition<T>,
    TUnknownType = unknown
> implements BaseModel<T, TDefinition, TUnknownType>
{
    constructor(
        value: T,
        definition: TDefinition,
        depth: number,
        factory: ModelFactory
    ) {
        this.value = value;
        this.definition = definition;
        this.depth = depth;
        this.factory = factory;
    }

    public readonly value: T;
    public readonly definition: TDefinition;
    public readonly depth: number;
    public readonly factory: ModelFactory;

    public get unknownValue(): TUnknownType {
        return this.value as any;
    }

    public get unknownDefinition(): Definition<unknown> {
        return this.definition;
    }
}
