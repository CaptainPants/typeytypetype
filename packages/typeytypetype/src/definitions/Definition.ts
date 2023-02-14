import { type ValidationResult } from './Validator.js';

export interface Definition<T> {
    matches: (value: unknown) => value is T;

    doMatches: (value: unknown, depth: number) => value is T;

    validate: (value: unknown) => ValidationResult;

    doValidate: (value: unknown, depth: number) => ValidationResult;

    toTypeString: () => string;

    doToTypeString: (depth: number) => string;

    hasLabel: (label: string) => boolean;

    getAttribute: (name: string) => unknown;
}
