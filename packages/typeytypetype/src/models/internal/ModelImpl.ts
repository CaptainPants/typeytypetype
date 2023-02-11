import { type Definition } from '../../definitions/Definition.js';
import { type BaseModel } from '../Model.js';
import { type ModelFactory } from '../ModelFactory.js';

export class ModelImpl<T, TDef extends Definition<T> = Definition<T>>
    implements BaseModel<T>
{
    constructor(
        value: T,
        definition: TDef,
        depth: number,
        factory: ModelFactory
    ) {
        this.value = value;
        this.definition = definition;
        this.depth = depth;
        this.factory = factory;
    }

    public readonly value: T;
    public readonly definition: TDef;
    public readonly depth: number;
    public readonly factory: ModelFactory;
}
