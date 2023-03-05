import { type Definition } from '@captainpants/typeytypetype';
import { type ValidationSingleResult } from '@captainpants/typeytypetype/build/definitions/Validator';
import { useEffect, useState } from 'react';
import { useAsyncCallback } from './useAsyncCallback.js';

export type UseValidatedDraftResult<TInput> = [
    draft: TInput,
    setDraft: (value: TInput) => void,
    validationResults: ValidationSingleResult[]
];

export interface UseValidatedDraftOptions<T, TInput> {
    value: T;
    definition: Definition<T>;

    convertIn: (value: T) => TInput;
    convertOut: (
        value: TInput
    ) => { success: true; value: T } | { success: false; errors: string[] };

    onValid: (value: T) => void;
}

export function useValidatedDraft<T, TInput>(
    options: UseValidatedDraftOptions<T, TInput>
): UseValidatedDraftResult<TInput>;
export function useValidatedDraft<T, TInput>({
    value,
    definition,
    convertIn,
    convertOut,
    onValid,
}: UseValidatedDraftOptions<T, TInput>): UseValidatedDraftResult<TInput> {
    const [draft, setDraft] = useState<TInput>(() => convertIn(value));
    const [validationResults, setValidationResults] = useState<
        ValidationSingleResult[]
    >([]);

    useEffect(() => {
        setDraft(convertIn(value));
    }, [value]);

    const [validate] = useAsyncCallback(
        async ({ signal }, newValue: TInput) => {
            const convertResult = convertOut(newValue);

            if (!convertResult.success) {
                setValidationResults(
                    convertResult.errors.map((x) => ({ message: x }))
                );
                return;
            }

            const converted = convertResult.value;

            const validationResult = await definition.validate(converted, {
                signal,
            });

            setValidationResults(validationResult);

            if (validationResult.length === 0) {
                onValid(converted);
            }
        },
        [convertOut, definition]
    );

    const resultSetDraft = (value: TInput): void => {
        setDraft(value);

        // throw away the result here
        void validate({}, value);
    };

    return [draft, resultSetDraft, validationResults];
}
