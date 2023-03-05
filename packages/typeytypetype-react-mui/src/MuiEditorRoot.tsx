
import React, { type ReactElement } from 'react';
import { EditorRoot, type EditorRootProps } from '@captainpants/typeytypetype-react';

export interface MuiEditorRootProps<T> extends EditorRootProps<T> {
}

export function MuiEditorRoot<T>(props: Readonly<MuiEditorRootProps<T>>): ReactElement {
    return <EditorRoot<T> {...props} />;
}