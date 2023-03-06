export type Either<TResult, TError = string> =
    | { success: true; result: TResult }
    | { success: false; error: TError };
