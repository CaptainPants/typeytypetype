import { BaseDefinition } from './BaseDefinition.js';

export abstract class ConstantDefinition<T> extends BaseDefinition<T> {
    constructor(value: T) {
        super();
        this.value = value;
    }

    readonly value: T;

    override doMatches(value: unknown, depth: number): value is T {
        return value === this.value;
    }

    override doToTypeString(depth: number): string {
        return JSON.stringify(this.value);
    }
}

export class StringConstantDefinition extends ConstantDefinition<string> {}

export class NumberConstantDefinition extends ConstantDefinition<number> {}

export class BooleanConstantDefinition extends ConstantDefinition<boolean> {}

export class UndefinedConstantDefinition extends ConstantDefinition<undefined> {
    constructor() {
        super(undefined);
    }
}

export class NullConstantDefinition extends ConstantDefinition<null> {
    constructor() {
        super(null);
    }
}
