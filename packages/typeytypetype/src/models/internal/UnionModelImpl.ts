import { type Definition } from '../../definitions/Definition.js';
import { type UnionDefinition } from '../../definitions/UnionDefinition.js';
import { descend } from '../../internal/descend.js';
import { stringForError } from '../../internal/stringForError.js';
import { isModel } from '../isModel.js';
import {
    type SpreadModel,
    type Model,
    type UnionModel,
    type ParentRelationship,
} from '../Model.js';
import { type ModelFactory } from '../ModelFactory.js';
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

        const match = factory.choose<TUnion>(value, definition);

        if (match === undefined) {
            throw new Error(`Could not find matching definition for value.`);
        }

        this.resolved = factory.create<TUnion>({
            parent,
            value,
            definition: match,
            depth: descend(depth),
        }) satisfies Model<TUnion> as unknown as SpreadModel<TUnion>;
    }

    readonly type = 'union';

    readonly resolved: SpreadModel<TUnion>;

    async unknownReplace(value: unknown): Promise<Model<unknown>> {
        let processedValue: unknown;

        if (isModel(value)) {
            if (this.definition !== value.unknownDefinition) {
                // Mismatch
                throw new TypeError(
                    `Unexpected value ${stringForError(value.unknownValue)}`
                );
            }
            processedValue = value.unknownValue as TUnion;
        } else {
            processedValue = await this.definition.validateCast(value);
        }

        const model = this.factory.create({
            parent: this.parent,
            value: processedValue,
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
