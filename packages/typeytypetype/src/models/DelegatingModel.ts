import { Definition } from '../definitions/Definition';
import { Lazy } from '../Lazy';
import { Replacer } from '../types';
import { Model } from './Model';
import { ModelFactory } from './ModelFactory';

export abstract class DelegatingModel<
    T,
    TDef extends Definition<T> = Definition<T>
> extends Model<T, TDef> {
    constructor(
        value: T,
        definition: TDef,
        replace: Replacer<T>,
        depth: number,
        factory: ModelFactory
    ) {
        super(value, definition, replace, depth, factory);

        this.#model = new Lazy(() => this.createModel());
    }

    #model: Lazy<Model<unknown>>;

    protected abstract createModel(): Model<unknown>;

    override elementDefinition(): Definition<unknown> | undefined {
        return this.#model.value.elementDefinition();
    }

    override getElement(index: number): Model<unknown> | undefined {
        return this.#model.value.getElement(index);
    }

    override async spliceElements(
        index: number,
        removeCount: number,
        newElements: unknown[]
    ): Promise<void> {
        await this.#model.value.spliceElements(index, removeCount, newElements);
    }

    override expandoPropertyDefinition(): Definition<unknown> | undefined {
        return this.#model.value.expandoPropertyDefinition();
    }

    override getExpandoProperty(key: string): Model<unknown> | undefined {
        return this.#model.value.getExpandoProperty(key);
    }

    override async setExpandoProperty(
        key: string,
        value: unknown
    ): Promise<void> {
        await this.#model.value.setExpandoProperty(key, value);
    }

    override async deleteExpandoProperty(key: string): Promise<void> {
        await this.#model.value.deleteExpandoProperty(key);
    }

    override fixedPropertyDefinition(
        key: string
    ): Definition<unknown> | undefined {
        return this.#model.value.fixedPropertyDefinition(key);
    }

    override getFixedProperty(key: string): Model<unknown> | undefined {
        return this.#model.value.getFixedProperty(key);
    }
}
