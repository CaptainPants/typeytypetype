import { type Definition } from '../definitions/Definition.js';
import { type SpreadDefinition } from '../definitions/index.js';
import { type UnionDefinition } from '../definitions/UnionDefinition.js';
import { type ParentRelationship, type Model } from './Model.js';

export interface ModelFactoryArgs<T> {
    parent?: ParentRelationship | null;
    value: T;
    definition: Definition<T>;
    depth: number;
}

export interface ModelFactory {
    create: <T>(args: ModelFactoryArgs<T>) => Model<T>;

    choose: <TUnion>(
        value: TUnion,
        definition: UnionDefinition<TUnion>
    ) => SpreadDefinition<TUnion> | undefined;
}
