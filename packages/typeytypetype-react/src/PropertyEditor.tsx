import {
    assertRigidObjectModel,
    type Model,
    type ParentDefinitionNode,
    type Replacer,
} from '@captainpants/typeytypetype';
import React, { useCallback, useMemo, type ReactElement } from 'react';
import { EditorHost } from './EditorHost.js';
import { useLocalizer } from './hooks';

export interface PropertyEditorProps {
    parentModel: Model<unknown>;
    parentReplacer: Replacer<unknown>;
    parentOfParent?: ParentDefinitionNode | undefined;
    propertyName: string;
}

export function PropertyEditor(props: PropertyEditorProps): ReactElement;
export function PropertyEditor({
    parentModel,
    parentReplacer,
    parentOfParent,
    propertyName,
}: PropertyEditorProps): ReactElement {
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
