import { type Type } from '../../types/Type.js';
import { type UnionType } from '../../types/UnionType.js';
import { descend } from '../../internal/descend.js';
import { type SpreadModel, type Model, type UnionModel } from '../Model.js';
import { type ModelFactory } from '../ModelFactory.js';
import { validateForAdoption } from './validateForAdoption.js';
import { ModelImpl } from './ModelImpl.js';

export class UnionModelImpl<TUnion>
    extends ModelImpl<TUnion, UnionType<TUnion>>
    implements UnionModel<TUnion>
{
    constructor(
        value: TUnion,
        type: UnionType<TUnion>,
        depth: number,
        factory: ModelFactory
    ) {
        super(value, type, depth, factory);

        const match = type.getTypeForValue(value);

        if (match === null) {
            throw new Error(`Could not find matching type for value.`);
        }

        this.resolved = factory.createUnvalidatedModelPart<TUnion>({
            value,
            type: match,
            depth: descend(depth),
        }) satisfies Model<TUnion> as unknown as SpreadModel<TUnion>;
    }

    readonly archetype = 'union';

    readonly resolved: SpreadModel<TUnion>;

    async unknownReplace(value: unknown): Promise<Model<unknown>> {
        const adopted = await validateForAdoption(value, this.type);

        const model = this.factory.createUnvalidatedModelPart({
            value: adopted,
            type: this.type,
            depth: descend(this.depth),
        });
        return model;
    }

    async replace(value: TUnion): Promise<Model<TUnion>> {
        return (await this.unknownReplace(value)) as Model<TUnion>;
    }

    as<T>(type: Type<T>): Model<T> | null {
        const resolved = this.resolved;
        return resolved.unknownType === type ? (resolved as any) : null;
    }
}
