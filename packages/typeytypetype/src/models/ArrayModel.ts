
import * as assert from 'typed-assert';
import { ArrayDefinition } from '../definitions/ArrayDefinition';
import { descend } from '../internal/descend';
import { Replacer } from '../types';
import { Model } from './Model';
import { ModelBase } from './ModelBase';
import { ModelCreationArgs } from './types';

export class ArrayModel<TElement> extends ModelBase<TElement[], ArrayDefinition<TElement>> {
    constructor(
        args: ModelCreationArgs<TElement[], ArrayDefinition<TElement>>
    ) {
        super(args);

        this.#elementModels = [];

        const elementDefinition = super.definition.getElementDefinition();

        for (let i = 0; i < super.value.length; ++i) {
            const capturedI = i;

            const item = super.value[i];
            assert.isNotUndefined(item);

            const model = super.factory.create<TElement>({
                value: item,
                definition: elementDefinition,
                replace: async (newValue) => {
                    // use captured version of 'i'
                    await this.spliceElements(capturedI, 1, [newValue]);
                },
                depth: descend(super.depth)
        });

            this.#elementModels.push(model);
        }
    }

    #elementModels: Array<Model<TElement>>;

    override getElement(index: number): Model<TElement> | undefined {
        const elementModel = this.#elementModels[index];

        return elementModel;
    }

    override async spliceElements(
        index: number,
        removeCount: number,
        newElements: TElement[]
    ): Promise<void> {
        const copy = [...this.value];
        copy.splice(index, removeCount, ...(newElements ));
        // Type system is fighting me
        await this.replace(copy);
    }

    override clone(replace: Replacer<TElement[]>): Model<TElement[], ArrayDefinition<TElement>> {
        return new ArrayModel<TElement>({
            value: this.value, 
            definition: this.definition, 
            replace, 
            depth: this.depth, 
            factory: this.factory
        });
    }
}
