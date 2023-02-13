import { type BaseDefinition } from '../definitions/BaseDefinition.js';
import { type SpreadDefinition } from '../definitions/index.js';
import { type UnionDefinition } from '../definitions/UnionDefinition.js';
import { type Model } from './Model.js';

export interface ModelFactoryArgs<T> {
    value: T;
    definition: BaseDefinition<T>;
    depth: number;
}

export interface ModelFactory {
    create: <T>(args: ModelFactoryArgs<T>) => Model<T>;

    choose: <TUnion>(
        value: TUnion,
        definition: UnionDefinition<TUnion>
    ) => SpreadDefinition<TUnion> | undefined;
}
