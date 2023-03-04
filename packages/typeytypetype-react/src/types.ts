import { type ComponentType } from 'react';
import {
    type Model,
    type Replacer,
    type MatcherRule,
} from '@captainpants/typeytypetype';

export interface EditorProps<T> {
    model: Model<T>;
    replace: Replacer<T>;
    Next: ComponentType<NextEditorProps<T>>;
}

export interface NextEditorProps<T> {
    model: Model<T>;
    replace: Replacer<T>;
}

export interface EditorHostProps<T> {
    model: Model<T>;
    replace: Replacer<T>;
}

export interface RootEditorProps<T> {
    model: Model<T>;
    replace: Replacer<T>;
    rules: Array<MatcherRule<ComponentType<EditorProps<unknown>>>>;
}
