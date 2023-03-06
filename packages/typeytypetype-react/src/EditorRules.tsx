import React, { type FunctionComponent } from 'react';
import { type ModelMatcherRule } from '@captainpants/typeytypetype';
import { EditorRulesContext } from './internal/EditorRulesContext.js';
import { type Editor } from './types.js';

export interface EditorRulesProps {
    rules: Array<ModelMatcherRule<Editor>>;
}

export const EditorRules: FunctionComponent<EditorRulesProps> = (props) => {
    return <EditorRulesContext.Provider value={props} />;
};
