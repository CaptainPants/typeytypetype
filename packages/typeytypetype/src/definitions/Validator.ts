export type ValidationResult = string[] | Iterable<string> | null;

export type Validator = (
    value: unknown
) => ValidationResult | Promise<ValidationResult>;
