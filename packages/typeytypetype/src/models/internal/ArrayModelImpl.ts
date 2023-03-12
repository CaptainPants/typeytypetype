import { type ArrayDefinition } from '../../definitions/ArrayDefinition.js';
import { type Definition } from '../../definitions/Definition.js';
import { descend } from '../../internal/descend.js';
import { mapAsync } from '../../internal/mapAsync.js';
import {
    type ArrayModel,
    type Model,
    type UnknownModel,
    type UnknownArrayModel,
} from '../Model.js';
import { type ModelFactory } from '../ModelFactory.js';
import { validateForAdoption } from './validateForAdoption.js';
import { ModelImpl } from './ModelImpl.js';

export class ArrayModelImpl<TElement>
    extends ModelImpl<TElement[], ArrayDefinition<TElement>, unknown[]>
    implements ArrayModel<TElement>
{
    constructor(
        value: TElement[],
        definition: ArrayDefinition<TElement>,
        depth: number,
        factory: ModelFactory
    ) {
        super(value, definition, depth, factory);

        this.#elementDefinition = definition.getElementDefinition();

        this.#elementModels = value.map((item, index) =>
            factory.createUnvalidatedModelPart({
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
            return await validateForAdoption(item, eleDefinition);
        });

        copy.splice(start, deleteCount, ...typed);

        await this.definition.validateAndThrow(copy, { deep: false });

        return this.factory.createUnvalidatedModelPart<TElement[]>({
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
