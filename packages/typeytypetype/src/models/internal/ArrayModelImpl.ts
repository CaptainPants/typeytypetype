import { type ArrayDefinition } from '../../definitions/ArrayDefinition.js';
import { type Definition } from '../../definitions/Definition.js';
import { descend } from '../../internal/descend.js';
import { type ElementType } from '../../types.js';
import { type ArrayModel, type Model } from '../Model.js';
import { type ModelFactory } from '../ModelFactory.js';
import { ModelImpl } from './ModelImpl.js';

export class ArrayModelImpl<TArray extends readonly unknown[]>
    extends ModelImpl<TArray, ArrayDefinition<TArray>>
    implements ArrayModel<TArray>
{
    constructor(
        value: TArray,
        definition: ArrayDefinition<TArray>,
        depth: number,
        factory: ModelFactory
    ) {
        super(value, definition, depth, factory);

        this.#elementDefinition = definition.getElementDefinition();

        this.#elementModels = (value as ReadonlyArray<ElementType<TArray>>).map(
            (item) =>
                factory.create<ElementType<TArray>>({
                    value: item,
                    definition: this.#elementDefinition,
                    depth: descend(depth),
                })
        );
    }

    readonly type = 'array';

    #elementDefinition: Definition<ElementType<TArray>>;
    #elementModels: Array<Model<ElementType<TArray>>>;

    elementDefinition(): Definition<ElementType<TArray>> {
        return this.#elementDefinition;
    }

    getElement(index: number): Model<ElementType<TArray>> | undefined {
        return this.#elementModels[index];
    }

    async spliceElements(
        start: number,
        deleteCount: number,
        newElements: Array<ElementType<TArray>>
    ): Promise<Model<TArray>> {
        const copy = [...this.value];
        copy.splice(start, deleteCount, ...newElements);

        return this.factory.create<TArray>({
            // @ts-expect-error -- Typescript can't work out that ElementType[TArray][] == TArray so will error here
            value: copy,
            definition: this.definition,
            depth: this.depth,
        });
    }
}
