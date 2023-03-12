import React, { type ReactElement } from 'react';

import { EditorHost } from './EditorHost.js';
import { type Model, type Replacer } from '@captainpants/typeytypetype';

export interface EditorRootProps<T> {
    model: Model<T>;
    replace: Replacer<T>;
}

export function EditorRoot<T>(
    props: Readonly<EditorRootProps<T>>
): ReactElement;
export function EditorRoot<T>({
    model,
    replace,
}: Readonly<EditorRootProps<T>>): ReactElement {
    return (
        <EditorHost model={model} replace={replace as any} parent={undefined} />
    );
}
