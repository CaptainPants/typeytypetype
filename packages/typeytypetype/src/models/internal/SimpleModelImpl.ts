import { type Type } from '../../types/Type.js';
import { type ModelFactory } from '../ModelFactory.js';
import { ModelImpl } from './ModelImpl.js';

export class SimpleModelImpl<
    T,
    TTypeType extends Type<T>,
    TArchetype extends string
> extends ModelImpl<T, TTypeType> {
    constructor(
        archetype: TArchetype,
        value: T,
        type: TTypeType,
        depth: number,
        factory: ModelFactory
    ) {
        super(value, type, depth, factory);

        this.archetype = archetype;
    }

    readonly archetype: TArchetype;
}
