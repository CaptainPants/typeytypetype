import { Definition } from '../definitions/Definition';
import { ElementType, Replacer } from '../types';
import { Model } from './Model';
export abstract class DelegatingModel<
    T,
    TDef extends Definition<T> = Definition<T>
> implements Model<T, TDef> {
    constructor(
        model: Model<T, TDef>
    ) {
        this.#model = model;
    }

    #model: Model<T, TDef>;

    get value(): T { return this.#model.value; }
    get definition(): TDef { return this.#model.definition; }
    abstract get replace(): Replacer<T>;

    elementDefinition(): Definition<ElementType<T>> | undefined {
        return this.#model.elementDefinition();
    }

    getElement(index: number): Model<ElementType<T>> | undefined {
        return this.#model.getElement(index);
    }

    async spliceElements(
        index: number,
        removeCount: number,
        newElements: Array<ElementType<T>>
    ): Promise<void> {
        await this.#model.spliceElements(index, removeCount, newElements);
    }

    expandoPropertyDefinition(): Definition<unknown> | undefined {
        return this.#model.expandoPropertyDefinition();
    }

    getExpandoProperty(key: string): Model<unknown> | undefined {
        return this.#model.getExpandoProperty(key);
    }

    async setExpandoProperty(
        key: string,
        value: unknown
    ): Promise<void> {
        await this.#model.setExpandoProperty(key, value);
    }

    async deleteExpandoProperty(key: string): Promise<void> {
        await this.#model.deleteExpandoProperty(key);
    }

    fixedPropertyDefinition(
        key: string
    ): Definition<unknown> | undefined {
        return this.#model.fixedPropertyDefinition(key);
    }

    getFixedProperty(key: string): Model<unknown> | undefined {
        return this.#model.getFixedProperty(key);
    }

    abstract clone(replacer: Replacer<T>): Model<T, TDef>;
}
