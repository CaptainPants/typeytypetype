import React, {
    Fragment,
    useMemo,
    type ReactElement,
    type ReactNode,
} from 'react';
import {
    assertRigidObjectModel,
    categorizeProperties,
    type PropertyModel,
} from '@captainpants/typeytypetype';
import { type EditorProps } from '../types.js';
import { PropertyEditorPart } from './PropertyEditorPart.js';

export interface BaseRigidObjectEditorCategoryRenderProps {
    renderCategory: (key?: string) => ReactNode;
    category: string;
}

export interface BaseRigidObjectEditorPropertyRenderProps {
    renderProperty: (key?: string) => ReactNode;
    propertyModel: PropertyModel<unknown>;
}

export interface BaseRigidObjectEditorProps extends EditorProps {
    renderCategory: (
        props: BaseRigidObjectEditorCategoryRenderProps
    ) => ReactNode;
    renderProperty: (
        props: BaseRigidObjectEditorPropertyRenderProps
    ) => ReactNode;
}

// TODO: ordering

export function BaseRigidObjectEditor(
    props: BaseRigidObjectEditorProps
): ReactElement;
export function BaseRigidObjectEditor({
    model,
    replace,
    parent,
    renderCategory,
    renderProperty,
}: BaseRigidObjectEditorProps): ReactElement {
    assertRigidObjectModel(model);

    const categorized = useMemo(() => categorizeProperties(model), [model]);

    return (
        <>
            {categorized.map((group) => {
                const renderCategoryCallback = (key?: string): ReactElement => {
                    return (
                        <Fragment key={key}>
                            {group.items.map((property) => {
                                const renderPropertyCallback = (
                                    key?: string
                                ): ReactElement => {
                                    return (
                                        <PropertyEditorPart
                                            key={key}
                                            propertyName={property.name}
                                            parentModel={model}
                                            parentReplacer={replace}
                                            grandParent={parent}
                                        />
                                    );
                                };

                                return renderProperty({
                                    propertyModel: property,
                                    renderProperty: renderPropertyCallback,
                                });
                            })}
                        </Fragment>
                    );
                };

                return renderCategory({
                    category: group.category,
                    renderCategory: renderCategoryCallback,
                });
            })}
        </>
    );
}
