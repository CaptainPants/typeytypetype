import { Definition, SpreadDefinition } from '../../definitions/index.js';
import { type UnionDefinition } from '../../definitions/UnionDefinition.js';
import { descend } from '../../internal/descend.js';
import { type SpreadModel, type Model, type UnionModel } from '../Model.js';
import { type ModelFactory } from '../ModelFactory.js';
import { ModelImpl } from './ModelImpl.js';

export class UnionModelImpl<TTypes extends readonly []>
    extends ModelImpl<TTypes[number], UnionDefinition<TTypes>>
    implements UnionModel<TTypes[number]>
{
    constructor(
        value: TTypes[number],
        definition: UnionDefinition<TTypes>,
        depth: number,
        factory: ModelFactory
    ) {
        super(value, definition, depth, factory);

        const match = factory.choose<TTypes>(value, definition);

        if (match === undefined) {
            throw new Error(`Could not find matching definition for value.`);
        }

        this.resolved = factory.create<TTypes[number]>({
            value,
            definition: match,
            depth: descend(depth),
        }) satisfies Model<TTypes[number]> as unknown as SpreadModel<
            TTypes[number]
        >;
    }

    readonly type = 'union';

    readonly resolved: SpreadModel<TTypes[number]>;

    async replace(value: TTypes[number]): Promise<Model<TTypes[number]>> {
        const model = this.factory.create({
            value,
            definition: this.definition,
            depth: descend(this.depth),
        });
        return model;
    }

    castTo<T>(definition: Definition<T>): Model<T> | null {
        const resolved = this.resolved;
        return resolved.definition === definition ? (resolved as any) : null;
    }
}
