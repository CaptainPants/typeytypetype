import { BaseDefinition } from './BaseDefinition.js';
import { BooleanDefinition } from './BooleanDefinition.js';
import { NumberDefinition } from './NumberDefinition.js';
import { StringDefinition } from './StringDefinition.js';

abstract class ConstantBaseDefinition<T> extends BaseDefinition<T> {
    constructor(value: T) {
        super();
        this.value = value;
    }

    readonly value: T;

    override doMatches(
        value: unknown,
        _deep: boolean,
        _depth: number
    ): value is T {
        return value === this.value;
    }

    override doToTypeString(depth: number): string {
        return JSON.stringify(this.value);
    }
}

export class UndefinedConstantDefinition extends ConstantBaseDefinition<undefined> {
    constructor() {
        super(undefined);
    }
}

export class NullConstantDefinition extends ConstantBaseDefinition<null> {
    constructor() {
        super(null);
    }
}

// == Slightly unpleasant duplication here because we want our constants to subclass their general definitions

export class StringConstantDefinition extends StringDefinition {
    constructor(value: string) {
        super();
        this.value = value;
    }

    readonly value: string;

    override doMatches(
        value: unknown,
        _deep: boolean,
        _depth: number
    ): value is string {
        return value === this.value;
    }

    override doToTypeString(depth: number): string {
        return JSON.stringify(this.value);
    }
}

export class NumberConstantDefinition extends NumberDefinition {
    constructor(value: number) {
        super();
        this.value = value;
    }

    readonly value: number;

    override doMatches(
        value: unknown,
        _deep: boolean,
        _depth: number
    ): value is number {
        return value === this.value;
    }

    override doToTypeString(depth: number): string {
        return JSON.stringify(this.value);
    }
}

export class BooleanConstantDefinition extends BooleanDefinition {
    constructor(value: boolean) {
        super();
        this.value = value;
    }

    readonly value: boolean;

    override doMatches(
        value: unknown,
        _deep: boolean,
        _depth: number
    ): value is boolean {
        return value === this.value;
    }

    override doToTypeString(depth: number): string {
        return JSON.stringify(this.value);
    }
}
