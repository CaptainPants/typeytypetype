import {
    type Either,
    type Type,
    type ValidationSingleResult,
} from '@captainpants/typeytypetype';
import { useCallback, useEffect, useState } from 'react';
import { useAsyncCallback } from './useAsyncCallback.js';

export interface UseValidatedDraftResult<TDraft> {
    draft: TDraft;
    setDraft: (value: TDraft) => void;
    isValidating: boolean;
    validationErrors: ValidationSingleResult[];
}

export interface UseValidatedDraftOptions<TModelValue, TDraft> {
    value: TModelValue;
    type: Type<TModelValue>;

    convertIn: (value: TModelValue) => TDraft;
    convertOut: (value: TDraft) => Either<TModelValue, string[]>;

    onValid: (value: TModelValue) => void;
}

export function useValidatedDraft<TModelValue, TDraft>(
    options: UseValidatedDraftOptions<TModelValue, TDraft>
): UseValidatedDraftResult<TDraft>;
export function useValidatedDraft<T, TInput>({
    value,
    type,
    convertIn,
    convertOut,
    onValid,
}: UseValidatedDraftOptions<T, TInput>): UseValidatedDraftResult<TInput> {
    const [draft, setDraft] = useState<TInput>(() => convertIn(value));
    const [validationErrors, setValidationResults] = useState<
        ValidationSingleResult[]
    >([]);

    useEffect(() => {
        setDraft(convertIn(value));
        // eslint-disable-next-line @grncdr/react-hooks/exhaustive-deps -- we only want to run when 'value' changes, using the latest version of convertIn
    }, [value]);

    const [validate, isValidating] = useAsyncCallback(
        async ({ signal }, newValue: TInput) => {
            const convertResult = convertOut(newValue);

            if (!convertResult.success) {
                setValidationResults(
                    convertResult.error.map((x) => ({ message: x }))
                );
                return;
            }

            const converted = convertResult.result;

            const validationResult = await type.validate(converted, {
                signal,
            });

            setValidationResults(validationResult);

            if (validationResult.length === 0) {
                onValid(converted);
            }
        },
        [convertOut, type, onValid]
    );

    const resultSetDraft = useCallback(
        (value: TInput): void => {
            setDraft(value);

            // throw away the result here
            void validate({}, value);
        },
        [validate]
    );

    return { draft, setDraft: resultSetDraft, isValidating, validationErrors };
}
