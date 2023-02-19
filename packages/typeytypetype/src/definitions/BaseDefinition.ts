import { deepFreeze } from '../internal/deepFreeze.js';
import { type Definition } from './Definition.js';
import { type Validator, type ValidationResult } from './Validator.js';

export abstract class BaseDefinition<T> implements Definition<T> {
    readonly validators: Array<Validator<T>> = [];
    readonly labels: string[] = [];
    readonly attributes: Map<string, unknown> = new Map<string, unknown>();

    /**
     * Calls the callback on the current definition, then freezes the definition.
     * @param callback
     * @returns
     */
    setup(callback: (self: this) => void): this {
        callback(this);
        this.freeze();
        return this;
    }

    freeze(): this {
        deepFreeze(this);
        return this;
    }

    withLabel(label: string): this {
        this.labels.push(label);
        return this;
    }

    withLabels(...labels: string[]): this {
        this.labels.push(...labels);
        return this;
    }

    withAttr(name: string, value: unknown): this {
        this.attributes.set(name, value);
        return this;
    }

    withValidator(validator: Validator<T>): this {
        this.validators.push(validator);
        return this;
    }

    matches(value: unknown): value is T {
        return this.doMatches(value, 25);
    }

    abstract doMatches(value: unknown, depth: number): value is T;

    async validate(value: unknown): ValidationResult {
        return await this.doValidate(value, 25);
    }

    async validateCast(value: unknown): Promise<T> {
        const res = await this.validate(value);
        if (res.length > 0) {
            throw new TypeError(
                `Value ${String(value)} did not pass validation: ${res.join(
                    ', '
                )}`
            );
        }
        return value as T;
    }

    async doValidate(value: unknown, depth: number): ValidationResult {
        // Note that this is a type assertion
        if (!this.doMatches(value, depth)) {
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

    hasLabel(label: string): boolean {
        return this.labels.includes(label);
    }

    getAttribute(name: string): unknown {
        return this.attributes.get(name);
    }
}
