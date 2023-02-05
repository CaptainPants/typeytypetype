import { ArrayDefinition } from '../../definitions/ArrayDefinition';
import { Definition } from '../../definitions/Definition';
import { descend } from '../../internal/descend';
import { ArrayModelParts, Model } from '../Model';
import { ModelFactory } from '../ModelFactory';
import { ModelImpl } from './ModelImpl';

export class ArrayModelImpl<TElement>
    extends ModelImpl<TElement[], ArrayDefinition<TElement>>
    implements ArrayModelParts<TElement>
{
    constructor(
        value: TElement[],
        definition: ArrayDefinition<TElement>,
        originalDefinition: Definition<TElement[]>,
        depth: number,
        factory: ModelFactory
    ) {
        super(value, definition, originalDefinition, depth, factory);

        this.#elementDefinition = definition.getElementDefinition();

        this.#elementModels = value.map((item) =>
            factory.create({
                value: item,
                definition: this.#elementDefinition,
                depth: descend(depth),
            })
        );
    }

    #elementDefinition: Definition<TElement>;
    #elementModels: Array<Model<TElement>>;

    elementDefinition(): Definition<TElement> {
        return this.#elementDefinition;
    }

    getElement(index: number): Model<TElement> | undefined {
        return this.#elementModels[index];
    }

    async spliceElements(
        start: number,
        deleteCount: number,
        newElements: TElement[]
    ): Promise<Model<TElement[]>> {
        const copy = [...this.value];
        copy.splice(start, deleteCount, ...newElements);
        return new ArrayModelImpl(
            copy,
            this.definition,
            this.originalDefinition,
            this.depth,
            this.factory
        );
    }
}
