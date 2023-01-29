import { createResolutionContext } from '../createResolutionContext';
import { UnionDefinition } from '../definitions/UnionDefinition';
import { createModel } from './createModel';
import { Model, ModelForElement } from './Model';

export class UnionModel<T> extends Model<T> {
    get unionDefinition(): UnionDefinition<T> {
        if (!(this.definition instanceof UnionDefinition))
            throw new TypeError('Unexpected type.');

        return this.definition;
    }

    element(index: number): ModelForElement<T> {
        const context = createResolutionContext();
        const match = this.unionDefinition.definitions.find((x) =>
            x.validate(context, index)
        );

        if (!Array.isArray(this.value)) {
            return undefined;
        }

        if (match === null) {
            throw new Error('Not expected');
        }

        const element = this.value[index];

        return createModel(element, match, () => Promise.resolve());
    }
    property<TKey extends string>(
        key: TKey
    ): TKey extends keyof T ? Model<T[TKey]> : Model<unknown> {
        throw new Error('Method not implemented.');
    }
}
