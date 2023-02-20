import { descend } from '../internal/descend.js';
import { BaseDefinition } from './BaseDefinition.js';
import { type Definition } from './Definition.js';

export class DeferredDefinition<T> extends BaseDefinition<T> {
    constructor(name: string) {
        super();
        this.name = name;
        this.definition = null;
    }

    public readonly name: string;
    public definition: Definition<T> | null;

    getDefinition(): Definition<T> {
        if (this.definition === null) throw new Error('Model not provided.');
        return this.definition;
    }

    override doMatches(
        value: unknown,
        deep: boolean,
        depth: number
    ): value is T {
        return this.getDefinition().doMatches(value, deep, descend(depth));
    }

    override doToTypeString(depth: number): string {
        return this.name;
    }
}
