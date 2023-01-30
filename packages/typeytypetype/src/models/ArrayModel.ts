import { ArrayDefinition } from '../definitions/ArrayDefinition';
import { descend } from '../internal/descend';
import { Lazy } from '../Lazy';
import { Replacer } from '../types';
import { Model } from './Model';
import { ModelFactory } from './ModelFactory';

export class ArrayModel<TArray extends unknown[]> extends Model<TArray, ArrayDefinition<TArray>> {
    constructor(
        value: TArray,
        definition: ArrayDefinition<TArray>,
        replace: Replacer<TArray>,
        depth: number,
        factory: ModelFactory
    ) {
        super(value, definition, replace, depth, factory);

        this.#elementModels = [];

        const elementDefinition = definition.getElementDefinition();

        for (let i = 0; i < value.length; ++i) {
            const capturedI = i;

            const item = new Lazy(() => {
                return factory.create(
                    value[i],
                    elementDefinition,
                    async (newValue) => {
                        await this.spliceElements(capturedI, 1, [newValue]);
                    },
                    descend(depth)
                );
            });
            this.#elementModels.push(item);
        }
    }

    #elementModels: Array<Lazy<Model<unknown>>>;

    override getElement(index: number): Model<unknown> | undefined {
        return this.#elementModels[index]?.value;
    }

    override async spliceElements(
        index: number,
        removeCount: number,
        newElements: unknown[]
    ): Promise<void> {
        const copy = [...this.value];
        copy.splice(index, removeCount, ...newElements);
        // Type system is fighting me
        await this.replace(copy satisfies Array<TArray[number]> as TArray);
    }

    override clone(replace: Replacer<TArray>): Model<TArray, ArrayDefinition<TArray>> {
        return new ArrayModel<TArray>(
            this.value, 
            this.definition, 
            replace, 
            this.depth, 
            this.factory
        );
    }
}
