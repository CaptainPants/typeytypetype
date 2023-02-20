import { type ValidationOptions, type ValidationResult } from './Validator.js';

export interface Definition<T> {
    matches: (value: unknown) => value is T;

    doMatches: (value: unknown, depth: number) => value is T;

    validate: (value: unknown, options?: ValidationOptions) => ValidationResult;

    validateCast: (value: unknown, options?: ValidationOptions) => Promise<T>;

    doValidate: (
        value: unknown,
        options: ValidationOptions,
        depth: number
    ) => ValidationResult;

    toTypeString: () => string;

    doToTypeString: (depth: number) => string;

    hasLabel: (label: string) => boolean;

    getAttribute: (name: string) => unknown;

    /**
     * This is 100% here just to allow type inference to match the type.
     * @returns
     */
    differentiator: () => T;
}
