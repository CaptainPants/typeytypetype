import { type ArrayDefinition } from '../../definitions/ArrayDefinition.js';
import { type Definition } from '../../definitions/Definition.js';
import { descend } from '../../internal/descend.js';
import { mapAsync } from '../../internal/mapAsync.js';
import { stringForError } from '../../internal/stringForError.js';
import { isModel } from '../isModel.js';
import {
    type ParentRelationship,
    type ArrayModel,
    type Model,
    type UnknownModel,
    type UnknownArrayModel,
} from '../Model.js';
import { type ModelFactory } from '../ModelFactory.js';
import { ModelImpl } from './ModelImpl.js';

export class ArrayModelImpl<TElement>
    extends ModelImpl<TElement[], ArrayDefinition<TElement>, unknown[]>
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
                parent: { type: 'element', model: this as any, index },
                value: item,
                definition: this.#elementDefinition,
                depth: descend(depth),
            })
        );
    }

    readonly type = 'array';

    #elementDefinition: Definition<TElement>;
    #elementModels: Array<Model<TElement>>;

    unknownElementDefinition(): Definition<unknown> {
        return this.#elementDefinition;
    }

    elementDefinition(): Definition<TElement> {
        return this.#elementDefinition;
    }

    unknownGetElement(index: number): UnknownModel | undefined {
        return this.getElement(index);
    }

    getElement(index: number): Model<TElement> | undefined {
        return this.#elementModels[index];
    }

    async unknownSpliceElements(
        start: number,
        deleteCount: number,
        newElements: unknown[]
    ): Promise<UnknownArrayModel> {
        const copy = [...this.value];

        const eleDefinition = this.elementDefinition();

        const typed = await mapAsync(newElements, async (item) => {
            if (isModel(item)) {
                // Refers to the same definition, so we don't need to test it
                if (item.unknownDefinition !== eleDefinition) {
                    throw new TypeError(
                        `Unexpected value ${stringForError(item.unknownValue)}`
                    );
                }
                return item.unknownValue as TElement;
            } else {
                return await eleDefinition.validateCast(item);
            }
        });

        copy.splice(start, deleteCount, ...typed);

        return this.factory.create<TElement[]>({
            parent: this.parent,
            value: copy,
            definition: this.definition,
            depth: this.depth,
        });
    }

    async spliceElements(
        start: number,
        deleteCount: number,
        newElements: Array<TElement | Model<TElement>>
    ): Promise<Model<TElement[]>> {
        return (await this.unknownSpliceElements(
            start,
            deleteCount,
            newElements
        )) as Model<TElement[]>;
    }
}
