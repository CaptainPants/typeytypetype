import {
    createModelMatcher,
    type ModelMatcherRule,
} from '@captainpants/typeytypetype';
import React, {
    type ReactElement,
    useContext,
    useMemo,
    type FunctionComponent,
} from 'react';
import { EditorRulesContext } from './internal/EditorRulesContext.js';
import {
    type Editor,
    type EditorHostProps,
    type NextEditorProps,
} from './types.js';

const Last = (): ReactElement => <>No match</>;

function createNextEditor(
    matches: Array<ModelMatcherRule<Editor>>,
    index: number
): FunctionComponent<NextEditorProps> {
    const Editor = matches[index]?.result ?? Last;

    // This name is hopefully preserved for viewing in the React developer browser extension
    const Next: FunctionComponent<NextEditorProps> = ({
        model,
        replace,
        propertyDisplayName,
    }) => {
        // memoize so that the identity stays the same between renders
        const InnerNext = useMemo(() => {
            return createNextEditor(matches, index + 1);
        }, []);

        return (
            <Editor
                model={model}
                replace={replace}
                propertyDisplayName={propertyDisplayName}
                Next={InnerNext}
            />
        );
    };

    return Next;
}

export function EditorHost<T>(
    props: Readonly<EditorHostProps<T>>
): ReactElement;
export function EditorHost<T>({
    model,
    replace,
    propertyDisplayName: propertyName,
}: Readonly<EditorHostProps<T>>): ReactElement {
    const { rules } = useContext(EditorRulesContext);

    const matches = useMemo(
        () => createModelMatcher<Editor>(rules).findAllMatches(model),
        [rules, model]
    );

    // TODO: memoize this based on the array elements
    // low priotity as the rules are unlikely to change dynamically it would be consistent to
    // allow it
    const InitialNextEditor = useMemo(() => {
        return createNextEditor(matches, 0);
    }, [matches]);

    // Cheating the type system here a bit
    // we'll need the editors themselves to validate that their models are the right type
    return (
        <InitialNextEditor
            model={model}
            replace={replace as any}
            propertyDisplayName={propertyName}
        />
    );
}
