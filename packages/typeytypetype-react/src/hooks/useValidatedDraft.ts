import { type Definition } from '@captainpants/typeytypetype';
import { type ValidationSingleResult } from '@captainpants/typeytypetype/build/definitions/Validator';
import { useCallback, useEffect, useState } from 'react';
import { useAsyncCallback } from './useAsyncCallback.js';

export type UseValidatedDraftResult<TDraft> = [
    draft: TDraft,
    setDraft: (value: TDraft) => void,
    validationResults: ValidationSingleResult[]
];

export interface UseValidatedDraftOptions<TModelValue, TDraft> {
    value: TModelValue;
    definition: Definition<TModelValue>;

    convertIn: (value: TModelValue) => TDraft;
    convertOut: (
        value: TDraft
    ) =>
        | { success: true; value: TModelValue }
        | { success: false; errors: string[] };

    onValid: (value: TModelValue) => void;
}

export function useValidatedDraft<TModelValue, TDraft>(
    options: UseValidatedDraftOptions<TModelValue, TDraft>
): UseValidatedDraftResult<TDraft>;
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
        [convertOut, definition, onValid]
    );

    const resultSetDraft = useCallback(
        (value: TInput): void => {
            setDraft(value);

            // throw away the result here
            void validate({}, value);
        },
        [validate]
    );

    return [draft, resultSetDraft, validationResults];
}
