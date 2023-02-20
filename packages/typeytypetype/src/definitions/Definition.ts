import { type ValidationOptions, type ValidationResult } from './Validator.js';

export interface Definition<T> {
    matches: (value: unknown) => value is T;

    doMatches: (value: unknown, deep: boolean, depth: number) => value is T;

    validate: (value: unknown, options?: ValidationOptions) => ValidationResult;

    validateAndTypeAssert: (value: unknown) => Promise<T>;

    doValidate: (
        value: unknown,
        options: ValidationOptions,
        depth: number
    ) => ValidationResult;

    toTypeString: () => string;

    doToTypeString: (depth: number) => string;

    hasLabel: (label: string) => boolean;

    getAttribute: (name: string) => unknown;
}
