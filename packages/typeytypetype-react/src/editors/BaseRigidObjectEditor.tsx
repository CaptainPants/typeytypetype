import React, { Fragment, type ReactElement, type ReactNode } from 'react';
import {
    assertRigidObjectModel,
    type PropertyModel,
} from '@captainpants/typeytypetype';
import { type EditorProps } from '../types.js';
import { PropertyEditor } from './PropertyEditor.js';

export interface BaseRigidObjectEditorPropertyRenderProps {
    renderEditor: (key?: string) => ReactNode;
    propertyModel: PropertyModel<unknown>;
}

export interface BaseRigidObjectEditorProps extends EditorProps {
    renderProperty: (
        props: BaseRigidObjectEditorPropertyRenderProps
    ) => ReactNode;
}

// TODO: categories and ordering

export function BaseRigidObjectEditor(
    props: BaseRigidObjectEditorProps
): ReactElement;
export function BaseRigidObjectEditor({
    model,
    replace,
    parent,
    renderProperty,
}: BaseRigidObjectEditorProps): ReactElement {
    assertRigidObjectModel(model);

    return (
        <>
            {model.unknownGetProperties().map((propertyModel) => {
                return (
                    <Fragment key={`prop-${propertyModel.name}`}>
                        {renderProperty({
                            renderEditor: (key) => (
                                <PropertyEditor
                                    key={key}
                                    propertyName={propertyModel.name}
                                    parentModel={model}
                                    parentReplacer={replace}
                                    parentOfParent={parent}
                                />
                            ),
                            propertyModel,
                        })}
                    </Fragment>
                );
            })}
            ;
        </>
    );
}
