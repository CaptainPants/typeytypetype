import { type ComponentType } from 'react';
import { type Model, type Replacer } from '@captainpants/typeytypetype';

export interface EditorProps {
    model: Model<unknown>;
    replace: Replacer<unknown>;
    propertyDisplayName?: string | undefined;
    Next: ComponentType<NextEditorProps>;
}

export type Editor = ComponentType<EditorProps>;

export interface NextEditorProps {
    model: Model<unknown>;
    replace: Replacer<unknown>;
    propertyDisplayName?: string | undefined;
}

export type NextEditor = ComponentType<NextEditorProps>;

export interface EditorHostProps<T> {
    model: Model<T>;
    replace: Replacer<T>;
    propertyDisplayName?: string | undefined;
}

export interface EditorRootProps<T> {
    model: Model<T>;
    replace: Replacer<T>;
}

export type Localizer = (key: string, args: unknown[]) => string;
