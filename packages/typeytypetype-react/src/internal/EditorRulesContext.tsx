import { createContext } from 'react';
import { type EditorRulesProps } from '../EditorRules.js';

export const EditorRulesContext = createContext<EditorRulesProps>({
    rules: [],
});
