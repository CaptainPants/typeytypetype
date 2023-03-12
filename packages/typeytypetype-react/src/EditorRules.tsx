import React, {
    useContext,
    useMemo,
    type FunctionComponent,
    type ReactElement,
} from 'react';
import { type ModelMatcherRule } from '@captainpants/typeytypetype';
import {
    EditorRulesContext,
    type EditorRulesContextType,
} from './internal/EditorRulesContext.js';
import { type Editor } from './types.js';

export interface EditorRulesProps {
    rules: Array<ModelMatcherRule<Editor>>;
    replace?: boolean | undefined;

    children?: ReactElement | undefined;
}

export const EditorRules: FunctionComponent<EditorRulesProps> = ({
    rules: newRules,
    replace = false,
    children,
}) => {
    const { rules: existingRules } = useContext(EditorRulesContext);

    const value: EditorRulesContextType = useMemo(() => {
        return {
            rules: replace ? newRules : existingRules.concat(newRules),
        };
    }, [existingRules, newRules, replace]);

    return (
        <EditorRulesContext.Provider value={value}>
            {children}
        </EditorRulesContext.Provider>
    );
};
