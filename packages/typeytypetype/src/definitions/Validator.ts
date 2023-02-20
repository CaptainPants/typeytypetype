export type ValidatorResult =
    | string[]
    | Iterable<string>
    | null
    | Promise<string[] | Iterable<string> | null>;

export type Validator<T> = (
    value: T
) => ValidatorResult | Promise<ValidatorResult>;

export interface ValidationOptions {
    deep?: boolean;
}
export type ValidationResult = Promise<string[]>;

export async function flattenValidatorResult(
    result: ValidatorResult | Promise<ValidatorResult>
): ValidationResult {
    const awaited = await result;
    return awaited === null
        ? []
        : Array.isArray(awaited)
        ? awaited
        : [...awaited];
}
