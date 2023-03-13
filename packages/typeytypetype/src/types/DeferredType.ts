import { descend } from '../internal/descend.js';
import { BaseType } from './BaseType.js';
import { type Type } from './Type.js';

export class DeferredType<T> extends BaseType<T> {
    constructor(name: string) {
        super();
        this.name = name;
        this.type = null;
    }

    public type: Type<T> | null;

    getUnderlyingType(): Type<T> {
        if (this.type === null) throw new Error('Model not provided.');
        return this.type;
    }

    override doMatches(
        value: unknown,
        deep: boolean,
        depth: number
    ): value is T {
        return this.getUnderlyingType().doMatches(value, deep, descend(depth));
    }

    override doToTypeString(depth: number): string {
        return this.name ?? '<unknown>';
    }
}
