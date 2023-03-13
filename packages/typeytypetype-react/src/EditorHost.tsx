import {
    createTypeMatcher,
    type TypeMatcherRule,
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
    matches: Array<TypeMatcherRule<Editor>>,
    index: number
): FunctionComponent<NextEditorProps> {
    const Editor = matches[index]?.result ?? Last;

    // This name is hopefully preserved for viewing in the React developer browser extension
    const Next: FunctionComponent<NextEditorProps> = ({
        model,
        replace,
        propertyDisplayName,
        parent,
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
                parent={parent}
                Next={InnerNext}
            />
        );
    };

    return Next;
}

export function EditorHost(props: Readonly<EditorHostProps>): ReactElement;
export function EditorHost({
    model,
    replace,
    propertyDisplayName,
    parent,
}: Readonly<EditorHostProps>): ReactElement {
    const { rules } = useContext(EditorRulesContext);

    const type = model.unknownType;

    const matches = useMemo(
        () =>
            createTypeMatcher<Editor>(rules).findAllMatches({
                type,
            }),
        [rules, type]
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
            replace={replace}
            propertyDisplayName={propertyDisplayName}
            parent={parent}
        />
    );
}
