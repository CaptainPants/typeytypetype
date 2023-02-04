import { Definition } from '../definitions/Definition';
import { Model } from './Model';
import { ModelFactory } from './ModelFactory';

export class ModelRoot<T> {
    constructor(root: T, definition: Definition<T>, factory: ModelFactory) {
        this.#model = factory.create({ value: root, definition, depth: 25 });
        this.#factory = factory;
    }

    #model: Model<T>;
    #factory: ModelFactory;

    #replacement = async (replacement: T): Promise<void> => {
        const newRoot = this.#factory.create({
            value: replacement,
            definition: this.#model.definition,
            depth: 25,
        });
        await this.onChange?.(newRoot);
        this.#model = newRoot;
    };

    public get model(): Model<T> {
        return this.#model;
    }

    public onChange?(newRoot: Model<T>): Promise<void>;
}
