import { type MatcherRule } from '@captainpants/typeytypetype';
import React, {
    type ComponentType,
    type ReactElement,
    useContext,
    useMemo,
    type FunctionComponent,
} from 'react';
import { EditorContext } from './internal/EditorContext.js';
import {
    type EditorHostProps,
    type EditorProps,
    type NextEditorProps,
} from './types.js';

const Last = (): ReactElement => <>No match</>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createNextEditor = (
    matches: Array<MatcherRule<ComponentType<EditorProps>>>,
    index: number
): FunctionComponent<NextEditorProps> => {
    const Editor = matches[index]?.result ?? Last;

    // This name is hopefully preserved for viewing in the React developer browser extension
    const Next: FunctionComponent<NextEditorProps> = ({ model, replace }) => {
        // memoize so that the identity stays the same between renders
        const InnerNext = useMemo(() => {
            return createNextEditor(matches, index + 1);
        }, []);

        return <Editor model={model} replace={replace} Next={InnerNext} />;
    };

    return Next;
};

export function EditorHost<T>(
    props: Readonly<EditorHostProps<T>>
): ReactElement;
export function EditorHost<T>({
    model,
    replace,
}: Readonly<EditorHostProps<T>>): ReactElement {
    const context = useContext(EditorContext);

    const InitialNextEditor = useMemo(() => {
        const matches = context.matcher.findAllMatches(model);

        return createNextEditor(matches, 0);
    }, [model]);

    // Cheating the type system here a bit
    // we'll need the editors themselves to validate that their models are the right type
    return <InitialNextEditor model={model} replace={replace as any} />;
}
