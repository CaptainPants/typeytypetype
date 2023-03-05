import { type Model } from '@captainpants/typeytypetype';
import { type ValidationSingleResult } from '@captainpants/typeytypetype/build/definitions/Validator';
import { useEffect, useState } from 'react';
import { useAsyncCallback } from './useAsyncCallback.js';

export function useValidated<T>(
    model: Model<T>,
    onValid: (value: T) => void
): [
    result: T,
    setDraft: (value: T) => void,
    validationResults: ValidationSingleResult[]
] {
    const [draft, setDraft] = useState<T>(model.unknownValue as T);
    const [validationResults, setValidationResults] = useState<
        ValidationSingleResult[]
    >([]);

    useEffect(() => {
        setDraft(model.unknownValue as T);
    }, [model]);

    const [validate] = useAsyncCallback(
        async ({ signal }, value) => {
            const validationResult = await model.unknownDefinition.validate(
                value,
                { signal }
            );

            setValidationResults(validationResult);

            if (validationResult.length === 0) {
                onValid(value as T);
            }
        },
        [model]
    );

    const resultSetDraft = (value: T): void => {
        setDraft(value);

        // throw away the result here
        void validate({}, value);
    };

    return [draft, resultSetDraft, validationResults];
}
