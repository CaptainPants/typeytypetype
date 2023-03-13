import {
    type ValidationOptions,
    type ValidationResult,
} from '../validation/types.js';

export interface Type<T> {
    matches: (value: unknown) => value is T;

    doMatches: (value: unknown, deep: boolean, depth: number) => value is T;

    validate: (value: unknown, options?: ValidationOptions) => ValidationResult;

    validateAndThrow: (
        value: unknown,
        options?: ValidationOptions
    ) => Promise<T>;

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
