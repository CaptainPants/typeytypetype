import {
    assertRigidObjectModel,
    type Model,
    type ParentDefinitionNode,
    type Replacer,
} from '@captainpants/typeytypetype';
import React, { useCallback, useMemo, type ReactElement } from 'react';
import { EditorHost } from '../EditorHost.js';
import { useLocalizer } from '../hooks';

export interface PropertyEditorPartProps {
    parentModel: Model<unknown>;
    parentReplacer: Replacer<unknown>;
    grandParent: ParentDefinitionNode | undefined;

    propertyName: string;
}

export function PropertyEditorPart(
    props: PropertyEditorPartProps
): ReactElement;
export function PropertyEditorPart({
    parentModel,
    parentReplacer,
    grandParent: parentOfParent,
    propertyName,
}: PropertyEditorPartProps): ReactElement {
    assertRigidObjectModel(parentModel);

    const { definition: propertyDefinition, valueModel: propertyValue } =
        parentModel.getProperty(propertyName);

    const parent: ParentDefinitionNode = useMemo(() => {
        const res: ParentDefinitionNode = {
            definition: propertyDefinition.type,
            relationship: { type: 'property', property: propertyName },
            parent: parentOfParent,
        };
        return res;
    }, [propertyDefinition, parentOfParent, propertyName]);

    const replace = useCallback(
        async (value: unknown) => {
            await parentReplacer(
                parentModel.setPropertyValue(propertyName, value)
            );
        },
        [parentReplacer, parentModel, propertyName]
    );

    const localize = useLocalizer();

    return (
        <EditorHost
            model={propertyValue}
            replace={replace}
            propertyDisplayName={localize(
                propertyDefinition.displayName ?? propertyName
            )}
            parent={parent}
        />
    );
}
