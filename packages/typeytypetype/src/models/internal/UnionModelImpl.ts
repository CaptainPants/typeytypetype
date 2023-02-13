import { type Definition } from '../../definitions/Definition.js';
import { type UnionDefinition } from '../../definitions/UnionDefinition.js';
import { descend } from '../../internal/descend.js';
import { type SpreadModel, type Model, type UnionModel } from '../Model.js';
import { type ModelFactory } from '../ModelFactory.js';
import { ModelImpl } from './ModelImpl.js';

export class UnionModelImpl<TUnion>
    extends ModelImpl<TUnion, UnionDefinition<TUnion>>
    implements UnionModel<TUnion>
{
    constructor(
        value: TUnion,
        definition: UnionDefinition<TUnion>,
        depth: number,
        factory: ModelFactory
    ) {
        super(value, definition, depth, factory);

        const match = factory.choose<TUnion>(value, definition);

        if (match === undefined) {
            throw new Error(`Could not find matching definition for value.`);
        }

        this.resolved = factory.create<TUnion>({
            value,
            definition: match,
            depth: descend(depth),
        }) satisfies Model<TUnion> as unknown as SpreadModel<TUnion>;
    }

    readonly type = 'union';

    readonly resolved: SpreadModel<TUnion>;

    async replace(value: TUnion): Promise<Model<TUnion>> {
        const model = this.factory.create({
            value,
            definition: this.definition,
            depth: descend(this.depth),
        });
        return model;
    }

    as<T>(definition: Definition<T>): Model<T> | null {
        const resolved = this.resolved;
        return resolved.definition === definition ? (resolved as any) : null;
    }
}
