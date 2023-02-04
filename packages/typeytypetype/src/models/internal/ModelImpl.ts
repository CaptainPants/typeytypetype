import { Definition } from "../../definitions/Definition";
import { ModelCommon } from "../Model";
import { ModelFactory } from "../ModelFactory";

export class ModelImpl<T, TDef extends Definition<T> = Definition<T>> implements ModelCommon<T> {
    constructor(value: T, definition: TDef, originalDefinition: Definition<T>, depth: number, factory: ModelFactory) {
        this.value = value;
        this.definition = definition;
        this.originalDefinition = originalDefinition;
        this.depth = depth;
        this.factory = factory;
    }

    public readonly value: T;
    public readonly definition: TDef;
    public readonly originalDefinition: Definition<T>;
    public readonly depth: number;
    public readonly factory: ModelFactory;
}