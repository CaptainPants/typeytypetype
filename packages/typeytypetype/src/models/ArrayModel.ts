
import * as assert from 'typed-assert';
import { ArrayDefinition } from '../definitions/ArrayDefinition';
import { descend } from '../internal/descend';
import { Replacer } from '../types';
import { Model } from './Model';
import { ModelFactory } from './ModelFactory';

export class ArrayModel<TElement> extends Model<TElement[], ArrayDefinition<TElement>> {
    constructor(
        value: TElement[],
        definition: ArrayDefinition<TElement>,
        replace: Replacer<TElement[]>,
        depth: number,
        factory: ModelFactory
    ) {
        super(value, definition, replace, depth, factory);

        this.#elementModels = [];

        const elementDefinition = definition.getElementDefinition();

        for (let i = 0; i < value.length; ++i) {
            const capturedI = i;

            const item = value[i];
            assert.isNotUndefined(item);

            const model = factory.create<TElement>(
                item,
                elementDefinition,
                async (newValue) => {
                    // use captured version of 'i'
                    await this.spliceElements(capturedI, 1, [newValue]);
                },
                descend(depth)
            );

            this.#elementModels.push(model);
        }
    }

    #elementModels: Array<Model<TElement>>;

    override getElement(index: number): Model<unknown> | undefined {
        const elementModel = this.#elementModels[index];

        return elementModel as (Model<unknown> | undefined);
    }

    override async spliceElements(
        index: number,
        removeCount: number,
        newElements: unknown[]
    ): Promise<void> {
        const copy = [...this.value];
        copy.splice(index, removeCount, ...(newElements as TElement[]));
        // Type system is fighting me
        await this.replace(copy);
    }

    override clone(replace: Replacer<TElement[]>): Model<TElement[], ArrayDefinition<TElement>> {
        return new ArrayModel<TElement>(
            this.value, 
            this.definition, 
            replace, 
            this.depth, 
            this.factory
        ) as any;
    }
}
