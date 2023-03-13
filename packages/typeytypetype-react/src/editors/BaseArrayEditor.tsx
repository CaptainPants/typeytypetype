import React, { type ReactElement, type ReactNode } from 'react';
import {
    assertArrayModel,
    isUnionModel,
    type Type,
    UnionType,
    type Model,
} from '@captainpants/typeytypetype';
import { type EditorProps } from '../types.js';
import { ElementEditorPart } from './ElementEditorPart.js';
import { useLocalizer } from '../hooks/useLocalizer.js';

export interface BaseArrayEditorElementRenderProps {
    renderElement: (key?: string) => ReactNode;
    elementModel: Model<unknown>;
}

export interface BaseArrayEditorProps extends EditorProps {
    renderElement: (props: BaseArrayEditorElementRenderProps) => ReactNode;
}

// TODO: adding, reordering

export function BaseArrayEditor(props: BaseArrayEditorProps): ReactElement;
export function BaseArrayEditor({
    model,
    replace,
    parent,
    renderElement: renderElementProp,
}: BaseArrayEditorProps): ReactElement {
    assertArrayModel(model);

    const localize = useLocalizer();

    const elementType = model.elementType();
    let types: Array<Type<unknown>>;

    if (elementType instanceof UnionType) {
        types = elementType.types;
    } else {
        types = [elementType];
    }

    const single = types.length === 1;
    const shouldShowAdd = types.length > 0;

    function renderAdd(): ReactElement {
        if (!shouldShowAdd) {
            return <></>;
        }

        if (single) {
            return <>Add</>;
        }

        return (
            <>
                {types.map((type) => {
                    return <>Add {localize(type.displayName) ?? type.name}</>;
                })}
            </>
        );
    }

    return (
        <>
            <>
                {model.unknownGetElements().map((elementModel, index) => {
                    const renderElementCallback = (
                        key?: string
                    ): ReactElement => {
                        return (
                            <ElementEditorPart
                                key={key}
                                index={index}
                                parentModel={model}
                                parentReplacer={replace}
                                grandParent={parent}
                            />
                        );
                    };

                    return renderElementProp({
                        elementModel,
                        renderElement: renderElementCallback,
                    });
                })}
            </>
            <>{renderAdd()}</>
        </>
    );
}
