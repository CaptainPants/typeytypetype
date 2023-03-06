import { type Model, type ModelMatcherRule } from '@captainpants/typeytypetype';
import { createContext } from 'react';
import { type Editor } from '../types.js';

export interface EditorRulesContextType {
    rules: Array<ModelMatcherRule<Editor, Model<unknown>>>;
}

export const EditorRulesContext = createContext<EditorRulesContextType>({
    rules: [],
});
