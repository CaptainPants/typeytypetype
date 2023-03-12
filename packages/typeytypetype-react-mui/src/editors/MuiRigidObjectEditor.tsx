import React, { type ReactElement } from 'react';

import {
    type EditorProps,
    RigidObjectEditor,
} from '@captainpants/typeytypetype-react';

export function MuiRigidObjectEditor(
    props: Readonly<EditorProps>
): ReactElement {
    return (
        <RigidObjectEditor
            {...props}
            renderProperty={({ renderEditor }) => renderEditor()}
        />
    );
}
