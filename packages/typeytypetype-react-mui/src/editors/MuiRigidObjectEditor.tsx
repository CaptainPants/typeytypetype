import React, { type ReactElement } from 'react';

import { assertRigidObjectModel } from '@captainpants/typeytypetype';
import {
    EditorHost,
    type EditorProps,
} from '@captainpants/typeytypetype-react';

export function MuiRigidObjectEditor({
    model,
    replace,
}: Readonly<EditorProps>): ReactElement {
    assertRigidObjectModel(model);

    return (
        <>
            {model.definition.getFixedPropertyNames().map((key) => {
                const propertyModel = model.getProperty(key);
                const displayName =
                    model.definition.getPropertyDefinition(key)?.displayName ??
                    key;

                const propertyReplace = async (
                    newValue: unknown
                ): Promise<void> => {
                    const updatedModel = await model.setPropertyValue(
                        key,
                        newValue
                    );
                    void replace(updatedModel);
                };

                return (
                    <EditorHost<unknown>
                        propertyDisplayName={displayName}
                        model={propertyModel}
                        replace={propertyReplace}
                    />
                );
            })}
        </>
    );
}
