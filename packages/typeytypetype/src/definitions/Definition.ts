import { type ValidationResult, type Validator } from './Validator.js';

export abstract class Definition<T> {
    readonly validators: Validator[] = [];

    freeze(): this {
        Object.freeze(this);
        return this;
    }

    addValidator(validator: Validator): this {
        this.validators.push(validator);
        return this;
    }

    matches(value: unknown): boolean {
        return this.doMatches(value, 25);
    }

    abstract doMatches(value: unknown, depth: number): boolean;

    async validate(value: unknown): Promise<ValidationResult> {
        return await this.doValidate(value, 25);
    }

    async doValidate(value: unknown, depth: number): Promise<ValidationResult> {
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
