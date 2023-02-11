import { Definition } from './Definition.js';

export class ConstantDefinition<T> extends Definition<T> {
    constructor(value: T) {
        super();
        this.#value = value;
    }

    #value: T;

    override doMatchesStructure(value: unknown, depth: number): boolean {
        return value === this.#value;
    }

    override doToTypeString(depth: number): string {
        return JSON.stringify(this.#value);
    }
}
