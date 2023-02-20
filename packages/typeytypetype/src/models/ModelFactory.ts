import { type Definition } from '../definitions/Definition.js';
import { type SpreadDefinition } from '../definitions/index.js';
import { type UnionDefinition } from '../definitions/UnionDefinition.js';
import { type ParentRelationship, type Model } from './Model.js';

export interface CreateModelArgs<T> {
    parent?: ParentRelationship | null | undefined;
    value: unknown;
    definition: Definition<T>;
}

export interface CreateModelPartArgs<T> {
    parent?: ParentRelationship | null | undefined;
    value: T;
    definition: Definition<T>;
    depth: number;
}

export interface ModelFactory {
    createModel: <T>(args: CreateModelArgs<T>) => Promise<Model<T>>;

    createModelPart: <T>(args: CreateModelPartArgs<T>) => Model<T>;

    choose: <TUnion>(
        value: TUnion,
        definition: UnionDefinition<TUnion>
    ) => SpreadDefinition<TUnion> | undefined;
}
