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
    signal?: AbortSignal;
}

export interface ValidationSingleResult {
    path?: string | undefined;
    message: string;
}
export type ValidationResult = Promise<ValidationSingleResult[]>;
