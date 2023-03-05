import { type ValidationSingleResult } from './types.js';

export function joinSingleValidationResults(
    results: ValidationSingleResult[]
): string {
    return results.map((x) => x.message).join(' ');
}
