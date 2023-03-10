import React, { useCallback, type ReactElement } from 'react';

import { TextField } from '@mui/material';

import {
    assertStringModel,
    joinSingleValidationResults,
} from '@captainpants/typeytypetype';
import {
    useValidatedDraft,
    type EditorProps,
} from '@captainpants/typeytypetype-react';

export function MuiTextEditor({
    model,
    replace,
}: Readonly<EditorProps>): ReactElement {
    assertStringModel(model);

    const { draft, setDraft, validationErrors } = useValidatedDraft({
        value: model.value,
        type: model.type,
        convertIn: (val) => val,
        convertOut: (val) => ({ success: true, result: val }),
        onValid: (validated) => {
            // fire and forget
            void replace(validated);
        },
    });

    const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        setDraft(evt.target.value);
    }, []);

    return (
        <TextField
            multiline
            onChange={onChange}
            value={draft}
            error={validationErrors.length > 0}
            helperText={joinSingleValidationResults(validationErrors)}
        />
    );
}
