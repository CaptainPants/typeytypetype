import { ArrayDefinition } from '../definitions/ArrayDefinition';
import { Definition } from '../definitions/Definition';
import { descend } from '../internal/descend';
import { Lazy } from '../Lazy';
import { Replacer } from '../types';
import { Model } from './Model';
import { ModelFactory } from './ModelFactory';

type ElementType<T> = T extends Array<infer S> ? S : never;

export class ArrayModel<T extends readonly unknown[]> extends Model<T> {
    constructor(
        value: T,
        definition: ArrayDefinition<T>,
        replace: Replacer<T>,
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

    override async spliceElements(index: number, removeCount: number, newElements: unknown[]): Promise<void> {
        const copy = this.value.slice();
        copy.splice(index, removeCount, ...newElements);
        await this.replace(copy as any as T);
    }
}
