import { type Matcher } from '@captainpants/typeytypetype';
import { type ComponentType, createContext } from 'react';
import { type EditorProps } from '../types.js';

export interface EditorContextType {
    matcher: Matcher<ComponentType<EditorProps<unknown>>>;
}

export const EditorContext = createContext<EditorContextType>({
    get matcher(): Matcher<ComponentType<EditorProps<unknown>>> {
        throw new TypeError('Context not supplied');
    },
});
