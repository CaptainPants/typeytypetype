import { type ArrayType } from '../../types/ArrayType.js';
import { type Type } from '../../types/Type.js';
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
    extends ModelImpl<TElement[], ArrayType<TElement>, unknown[]>
    implements ArrayModel<TElement>
{
    constructor(
        value: TElement[],
        type: ArrayType<TElement>,
        depth: number,
        factory: ModelFactory
    ) {
        super(value, type, depth, factory);

        this.#elementDefinition = type.getElementType();

        this.#elementModels = value.map((item, index) =>
            factory.createUnvalidatedModelPart({
                value: item,
                type: this.#elementDefinition,
                depth: descend(depth),
            })
        );
    }

    readonly archetype = 'array';

    #elementDefinition: Type<TElement>;
    #elementModels: ReadonlyArray<Model<TElement>>;

    unknownElementType(): Type<unknown> {
        return this.#elementDefinition;
    }

    elementType(): Type<TElement> {
        return this.#elementDefinition;
    }

    unknownGetElement(index: number): UnknownModel | undefined {
        return this.getElement(index);
    }

    getElement(index: number): Model<TElement> | undefined {
        return this.#elementModels[index];
    }

    unknownGetElements(): ReadonlyArray<Model<unknown>> {
        return this.#elementModels;
    }

    getElements(): ReadonlyArray<Model<TElement>> {
        return this.#elementModels;
    }

    async unknownSpliceElements(
        start: number,
        deleteCount: number,
        newElements: readonly unknown[]
    ): Promise<UnknownArrayModel> {
        const copy = [...this.value];

        const eleDefinition = this.elementType();

        const typed = await mapAsync(newElements, async (item) => {
            return await validateForAdoption(item, eleDefinition);
        });

        copy.splice(start, deleteCount, ...typed);

        await this.type.validateAndThrow(copy, { deep: false });

        return this.factory.createUnvalidatedModelPart<TElement[]>({
            value: copy,
            type: this.type,
            depth: this.depth,
        });
    }

    async spliceElements(
        start: number,
        deleteCount: number,
        newElements: ReadonlyArray<TElement | Model<TElement>>
    ): Promise<Model<TElement[]>> {
        return (await this.unknownSpliceElements(
            start,
            deleteCount,
            newElements
        )) as Model<TElement[]>;
    }
}
