import { descend } from '../internal/descend.js';
import { Definition } from './Definition.js';

export class DeferredDefinition<T> extends Definition<T> {
    constructor(name: string) {
        super();
        this.name = name;
        this.definition = null;
    }

    public name: string;
    public definition: Definition<T> | null;

    getDefinition(): Definition<T> {
        if (this.definition === null) throw new Error('Model not provided.');
        return this.definition;
    }

    override doMatches(value: unknown, depth: number): boolean {
        return this.getDefinition().doMatches(value, descend(depth));
    }

    override doToTypeString(depth: number): string {
        return this.name;
    }
}
