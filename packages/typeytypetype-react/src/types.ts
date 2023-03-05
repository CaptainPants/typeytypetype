import { type ComponentType } from 'react';
import {
    type Model,
    type Replacer,
    type MatcherRule,
} from '@captainpants/typeytypetype';

export interface EditorProps {
    model: Model<unknown>;
    replace: Replacer<unknown>;
    Next: ComponentType<NextEditorProps>;
}

export interface NextEditorProps {
    model: Model<unknown>;
    replace: Replacer<unknown>;
}

export interface EditorHostProps<T> {
    model: Model<T>;
    replace: Replacer<T>;
}

export interface EditorRootProps<T> {
    model: Model<T>;
    replace: Replacer<T>;
    rules: Array<MatcherRule<ComponentType<EditorProps>>>;
}
