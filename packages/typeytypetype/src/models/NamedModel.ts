import { NamedDefinition } from '../definitions/NamedDefinition';
import { descend } from '../internal/descend';
import { Replacer } from '../types';
import { DelegatingModel } from './DelegatingModel';
import { Model } from './Model';

export class NamedModel<T> extends DelegatingModel<T, NamedDefinition<T>> {
    protected override createModel(): Model<unknown> {
        return this.factory.create(
            this.value,
            this.definition.getDefinition(),
            this.replace,
            descend(this.depth)
        ) satisfies Model<T> as Model<unknown>;
    }

    override clone(replace: Replacer<T>): Model<T, NamedDefinition<T>> {
        return new NamedModel<T>(
            this.value, 
            this.definition, 
            replace, 
            this.depth, 
            this.factory
        );
    }
}
