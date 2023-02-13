import { deepFreeze } from '../internal/deepFreeze.js';
import { type Validator, type ValidationResult } from './Validator.js';

export abstract class Definition<T> {
    readonly validators: Array<Validator<T>> = [];
    readonly labels: string[] = [];
    readonly attributes: Record<string, unknown> = {};

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

    addLabel(label: string): this {
        this.labels.push(label);
        return this;
    }

    addLabels(...labels: string[]): this {
        this.labels.push(...labels);
        return this;
    }

    addAttribute(name: string, value: unknown): this {
        this.attributes[name] = value;
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

    /**
     * Cast the definition as Definition<unknown> - this won't happen naturally as the parameters to validate are strongly typed.
     * TODO: should we restructure to get validate out of Definition into a subclass, and build a type safe conversion in as the
     * first step? OR have an interface above Definition that we use for 'unknown'-ing, that doesn't have any typed methods.
     * Maybe the current one becomes 'TypedDefinition' or 'BaseDefinition' and the new ancestor interface/class become 'Definition'.
     * @returns
     */
    asUnknown(): Definition<unknown> {
        return this as any;
    }
}
