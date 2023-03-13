import { type ComponentType } from 'react';
import {
    type ParentDefinitionNode,
    type Model,
    type Replacer,
} from '@captainpants/typeytypetype';

interface EditorLikeProps<T> {
    model: Model<T>;
    replace: Replacer<T>;
    propertyDisplayName?: string | undefined;
    parent: ParentDefinitionNode | undefined;
}

export interface EditorProps extends EditorLikeProps<unknown> {
    Next: ComponentType<NextEditorProps>;
}

// export interface ElementEditorProps extends EditorProps {
//     index: number;
// }

// export interface MapEntryEditorProps extends EditorProps {
//     propertyName: string;
// }

export interface NextEditorProps extends EditorLikeProps<unknown> {}

export interface EditorHostProps extends EditorLikeProps<unknown> {}

export type Editor = ComponentType<EditorProps>;
export type NextEditor = ComponentType<NextEditorProps>;

export type Localizer = (
    key?: string | undefined | null,
    args?: unknown[]
) => string;
