import { Definition } from '../definitions/Definition';
import { createModel } from './createModel';
import { Model } from './Model';

export class ModelRoot<T> {
    constructor(root: T, definition: Definition<T>) {
        this.#model = createModel(root, definition, this.#replacement, 25);
    }

    #model: Model<T>;

    #replacement = async (replacement: T): Promise<void> => {
        const newRoot = createModel(
            replacement,
            this.#model.definition,
            this.#replacement,
            25
        );
        await this.onChange?.(newRoot);
        this.#model = newRoot;
    };

    public get model(): Model<T> {
        return this.#model;
    }

    public onChange?(newRoot: Model<T>): Promise<void>;
}
