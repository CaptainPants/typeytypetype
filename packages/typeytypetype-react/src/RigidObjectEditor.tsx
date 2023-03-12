import React, { Fragment, type ReactElement, type ReactNode } from 'react';
import { assertRigidObjectModel } from '@captainpants/typeytypetype';
import { type EditorProps } from './types.js';
import { PropertyEditor } from './PropertyEditor.js';

export interface RigidObjectEditorPropertyRenderProps {
    renderEditor: () => ReactNode;
}

export interface RigidObjectEditorProps extends EditorProps {
    renderProperty: (props: RigidObjectEditorPropertyRenderProps) => ReactNode;
}

// TODO: categories and ordering

export function RigidObjectEditor(props: RigidObjectEditorProps): ReactElement;
export function RigidObjectEditor({
    model,
    replace,
    parent,
    renderProperty,
}: RigidObjectEditorProps): ReactElement {
    assertRigidObjectModel(model);

    return (
        <>
            {model.definition.getFixedPropertyNames().map((key) => {
                return (
                    <Fragment key={`prop-${key}`}>
                        {renderProperty({
                            renderEditor: () => (
                                <PropertyEditor
                                    propertyName={key}
                                    parentModel={model}
                                    parentReplacer={replace}
                                    parentOfParent={parent}
                                />
                            ),
                        })}
                    </Fragment>
                );
            })}
            ;
        </>
    );
}
