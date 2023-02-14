import { type ArrayDefinition } from '../../definitions/ArrayDefinition.js';
import { type Definition } from '../../definitions/Definition.js';
import { descend } from '../../internal/descend.js';
import {
    type ParentRelationship,
    type ArrayModel,
    type Model,
} from '../Model.js';
import { type ModelFactory } from '../ModelFactory.js';
import { ModelImpl } from './ModelImpl.js';

export class ArrayModelImpl<TElement>
    extends ModelImpl<TElement[], ArrayDefinition<TElement>>
    implements ArrayModel<TElement>
{
    constructor(
        parent: ParentRelationship | null,
        value: TElement[],
        definition: ArrayDefinition<TElement>,
        depth: number,
        factory: ModelFactory
    ) {
        super(parent, value, definition, depth, factory);

        this.#elementDefinition = definition.getElementDefinition();

        this.#elementModels = value.map((item, index) =>
            factory.create({
                parent: { $elementOf: this as any, index },
                value: item,
                definition: this.#elementDefinition,
                depth: descend(depth),
            })
        );
    }

    readonly type = 'array';

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

        return this.factory.create<TElement[]>({
            parent: this.parent,
            value: copy,
            definition: this.definition,
            depth: this.depth,
        });
    }
}
