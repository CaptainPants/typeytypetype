import React, { useMemo, type ReactElement } from 'react';
import { type EditorRootProps } from './types.js';
import { Matcher } from '@captainpants/typeytypetype';
import {
    EditorContext,
    type EditorContextType,
} from './internal/EditorContext.js';
import { EditorHost } from './EditorHost.js';

export function EditorRoot<T>(
    props: Readonly<EditorRootProps<T>>
): ReactElement;
export function EditorRoot<T>({
    model,
    replace,
    rules,
}: Readonly<EditorRootProps<T>>): ReactElement {
    const contextValue = useMemo<EditorContextType>(() => {
        const matcher = new Matcher(rules);
        return {
            matcher,
        };
    }, [rules]);

    return (
        <EditorContext.Provider value={contextValue}>
            <EditorHost model={model} replace={replace} />
        </EditorContext.Provider>
    );
}
