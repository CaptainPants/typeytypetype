import { BaseType } from './BaseType.js';
import { BooleanType } from './BooleanType.js';
import { NumberType } from './NumberType.js';
import { StringType } from './StringType.js';

abstract class ConstantBaseType<T> extends BaseType<T> {
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

export class UndefinedConstantType extends ConstantBaseType<undefined> {
    constructor() {
        super(undefined);
    }
}

export class NullConstantType extends ConstantBaseType<null> {
    constructor() {
        super(null);
    }
}

// == Slightly unpleasant duplication here because we want our constants to subclass their general types

export class StringConstantType extends StringType {
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

export class NumberConstantType extends NumberType {
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

export class BooleanConstantType extends BooleanType {
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
