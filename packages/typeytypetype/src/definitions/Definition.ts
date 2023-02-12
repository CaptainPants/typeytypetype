import { deepFreeze } from '../internal/deepFreeze.js';
import { type Validator, type ValidationResult } from './Validator.js';

export abstract class Definition<T> {
    readonly validators: Array<Validator<T>> = [];

    setup(callback: (self: this) => void): this {
        callback(this);
        return this;
    }

    freeze(): this {
        deepFreeze(this);
        return this;
    }

    addValidator(validator: Validator<T>): this {
        this.validators.push(validator);
        return this;
    }

    matches(value: unknown): boolean {
        return this.doMatches(value, 25);
    }

    abstract doMatches(value: unknown, depth: number): boolean;

    async validate(value: T): ValidationResult {
        return await this.doValidate(value, 25);
    }

    async doValidate(value: T, depth: number): ValidationResult {
        const isMatch = this.doMatches(value, depth);

        if (!isMatch) {
            return ['Non-matching structure'];
        }

        const errors: string[] = [];
        for (const validator of this.validators) {
            const result = await validator(value);

            if (result !== null) {
                errors.push(...result);
            }
        }

        return errors;
    }

    toTypeString(): string {
        return this.doToTypeString(25);
    }

    abstract doToTypeString(depth: number): string;

    /**
     * This is 100% here just to allow type inference to match the type.
     * @returns
     */
    differentiator(): T {
        throw new Error('Do not call this method.');
    }
}
