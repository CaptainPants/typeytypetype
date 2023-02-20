export type ValidatorResult =
    | string[]
    | Iterable<string>
    | null
    | Promise<string[] | Iterable<string> | null>;

export type Validator<T> = (
    value: T
) => ValidatorResult | Promise<ValidatorResult>;

export interface ValidationOptions {
    deep?: boolean | undefined;
}

export interface ValidationSingleResult {
    path?: string | undefined;
    message: string;
}
export type ValidationResult = Promise<ValidationSingleResult[]>;

export async function flattenValidatorResult(
    result: ValidatorResult | Promise<ValidatorResult>
): Promise<string[]> {
    const awaited = await result;
    return awaited === null
        ? []
        : Array.isArray(awaited)
        ? awaited
        : [...awaited];
}
