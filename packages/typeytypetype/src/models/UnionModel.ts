import { Definition } from '../definitions/Definition';
import { UnionDefinition } from '../definitions/UnionDefinition';
import { descend } from '../internal/descend';
import { DelegatingModel } from './DelegatingModel';
import { Model } from './Model';

export class UnionModel<
    TTypes extends readonly unknown[]
> extends DelegatingModel<TTypes[number], UnionDefinition<TTypes>> {
    protected override createModel(): Model<unknown> {
        const matchingDef = this.#findDefinition(this.value);

        return this.factory.create(
            this.value,
            matchingDef,
            this.replace,
            descend(this.depth)
        );
    }

    #findDefinition(value: unknown): Definition<unknown> {
        const res = this.definition.getDefinition(this.value);
        if (res === undefined) {
            throw new TypeError('Unexpected');
        }
        return res;
    }
}
