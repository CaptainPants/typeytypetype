import { type Definition } from '../../definitions/Definition.js';
import { type ParentRelationship, type BaseModel } from '../Model.js';
import { type ModelFactory } from '../ModelFactory.js';

export class ModelImpl<T, TDef extends Definition<T> = Definition<T>>
    implements BaseModel<T>
{
    constructor(
        parent: ParentRelationship | null,
        value: T,
        definition: TDef,
        depth: number,
        factory: ModelFactory
    ) {
        this.parent = parent;
        this.value = value;
        this.definition = definition;
        this.depth = depth;
        this.factory = factory;
    }

    public readonly parent: ParentRelationship | null;
    public readonly value: T;
    public readonly definition: TDef;
    public readonly depth: number;
    public readonly factory: ModelFactory;

    public get unknownValue(): unknown {
        return this.value;
    }

    public get unknownDefinition(): Definition<unknown> {
        return this.definition;
    }
}
