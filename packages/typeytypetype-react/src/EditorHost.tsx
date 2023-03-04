import { type MatcherRule } from '@captainpants/typeytypetype';
import React, {
    type ComponentType,
    type ReactElement,
    useContext,
    useMemo,
} from 'react';
import { EditorContext } from './internal/EditorContext.js';
import {
    type EditorHostProps,
    type EditorProps,
    type NextEditorProps,
} from './types.js';

export function EditorHost<T>(
    props: Readonly<EditorHostProps<T>>
): ReactElement;
export function EditorHost<T>({
    model,
    replace,
}: Readonly<EditorHostProps<T>>): ReactElement {
    const context = useContext(EditorContext);

    const Editor = useMemo(() => {
        const matches = context.matcher.findAllMatches(model);

        // Worst case there are no matches
        let Next: ComponentType<NextEditorProps<T>> = () => <>No match</>;

        for (let i = matches.length - 1; i >= 0; --i) {
            const NextEditor = (
                matches[i] as MatcherRule<ComponentType<EditorProps<T>>>
            ).result;

            Next = ({ model, replace }: NextEditorProps<T>): ReactElement => {
                return (
                    <NextEditor model={model} replace={replace} Next={Next} />
                );
            };
        }

        return Next;
    }, [model]);

    return <Editor model={model} replace={replace} />;
}
