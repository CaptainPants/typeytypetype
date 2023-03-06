import React, { type ReactElement } from 'react';
import { type EditorRootProps } from './types.js';

import { EditorHost } from './EditorHost.js';

export function EditorRoot<T>(
    props: Readonly<EditorRootProps<T>>
): ReactElement;
export function EditorRoot<T>({
    model,
    replace,
}: Readonly<EditorRootProps<T>>): ReactElement {
    return <EditorHost model={model} replace={replace} />;
}
