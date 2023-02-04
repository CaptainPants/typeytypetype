import { Definition } from "../definitions/Definition"
import { Replacer } from "../types";
import { ModelFactory } from "./ModelFactory";

export interface ModelFactoryArgs<T, TDef extends Definition<T>> {
    value: T;
    definition: TDef;
    replace: Replacer<T>;
    depth: number;
}

export interface ModelCreationArgs<T, TDef extends Definition<T>> {
    value: T;
    definition: TDef;
    replace: Replacer<T>;
    depth: number;
    factory: ModelFactory;
}