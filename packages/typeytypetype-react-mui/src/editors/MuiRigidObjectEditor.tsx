import React, { type ReactElement } from 'react';

import {
    type EditorProps,
    BaseRigidObjectEditor,
} from '@captainpants/typeytypetype-react';

export function MuiRigidObjectEditor(
    props: Readonly<EditorProps>
): ReactElement {
    return (
        <BaseRigidObjectEditor
            {...props}
            renderCategory={({ renderCategory }) => renderCategory()}
            renderProperty={({ renderProperty }) => renderProperty()}
        />
    );
}
