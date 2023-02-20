import { type Definition } from '../../definitions/Definition.js';
import { type UnionDefinition } from '../../definitions/UnionDefinition.js';
import { descend } from '../../internal/descend.js';
import {
    type SpreadModel,
    type Model,
    type UnionModel,
    type ParentRelationship,
} from '../Model.js';
import { type ModelFactory } from '../ModelFactory.js';
import { adoptAndValidate } from './adoptAndValidate.js';
import { ModelImpl } from './ModelImpl.js';

export class UnionModelImpl<TUnion>
    extends ModelImpl<TUnion, UnionDefinition<TUnion>>
    implements UnionModel<TUnion>
{
    constructor(
        parent: ParentRelationship | null,
        value: TUnion,
        definition: UnionDefinition<TUnion>,
        depth: number,
        factory: ModelFactory
    ) {
        super(parent, value, definition, depth, factory);

        const match = definition.getDefinition(value);

        if (match === undefined) {
            throw new Error(`Could not find matching definition for value.`);
        }

        this.resolved = factory.createModelPart<TUnion>({
            parent,
            value,
            definition: match,
            depth: descend(depth),
        }) satisfies Model<TUnion> as unknown as SpreadModel<TUnion>;
    }

    readonly type = 'union';

    readonly resolved: SpreadModel<TUnion>;

    async unknownReplace(value: unknown): Promise<Model<unknown>> {
        const adopted = await adoptAndValidate(value, this.definition);

        const model = this.factory.createModelPart({
            parent: this.parent,
            value: adopted,
            definition: this.definition,
            depth: descend(this.depth),
        });
        return model;
    }

    async replace(value: TUnion): Promise<Model<TUnion>> {
        return (await this.unknownReplace(value)) as Model<TUnion>;
    }

    as<T>(definition: Definition<T>): Model<T> | null {
        const resolved = this.resolved;
        return resolved.unknownDefinition === definition
            ? (resolved as any)
            : null;
    }
}
