import { type TypeMatcherRule } from '@captainpants/typeytypetype';
import { createContext } from 'react';
import { type Editor } from '../types.js';

export interface EditorRulesContextType {
    rules: Array<TypeMatcherRule<Editor>>;
}

export const EditorRulesContext = createContext<EditorRulesContextType>({
    rules: [],
});
