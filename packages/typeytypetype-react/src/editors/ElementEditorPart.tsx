import {
    assertArrayModel,
    type Model,
    type ParentDefinitionNode,
    type Replacer,
} from '@captainpants/typeytypetype';
import React, { useCallback, useMemo, type ReactElement } from 'react';
import { EditorHost } from '../EditorHost.js';
import { useLocalizer } from '../hooks';

export interface ElementEditorPartProps {
    parentModel: Model<unknown>;
    parentReplacer: Replacer<unknown>;
    grandParent: ParentDefinitionNode | undefined;

    index: number;
}

export function ElementEditorPart(props: ElementEditorPartProps): ReactElement;
export function ElementEditorPart({
    parentModel,
    parentReplacer,
    grandParent: parentOfParent,
    index,
}: ElementEditorPartProps): ReactElement {
    assertArrayModel(parentModel);

    const elementModel = parentModel.unknownGetElement(index);
    if (elementModel === undefined) {
        throw new Error(`No element as index ${index}.`);
    }

    const parent: ParentDefinitionNode = useMemo(() => {
        const res: ParentDefinitionNode = {
            type: parentModel.type,
            relationship: { type: 'element' },
            parent: parentOfParent,
        };
        return res;
    }, [parentModel.type, parentOfParent]);

    const replace = useCallback(
        async (value: unknown) => {
            await parentReplacer(
                parentModel.unknownSpliceElements(index, 1, [value])
            );
        },
        [parentReplacer, parentModel, index]
    );

    const localize = useLocalizer();

    return (
        <EditorHost
            model={elementModel}
            replace={replace}
            propertyDisplayName={localize('Element {0}', [index + 1])}
            parent={parent}
        />
    );
}
