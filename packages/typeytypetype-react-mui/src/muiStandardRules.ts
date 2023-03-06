import {
    type ModelMatcherRule,
    RigidObjectDefinition,
    Rule,
    StringDefinition,
    type Model,
} from '@captainpants/typeytypetype';
import { type Editor } from '@captainpants/typeytypetype-react';
import { MuiRigidObjectEditor } from './editors/MuiRigidObjectEditor.js';
import { MuiTextEditor } from './editors/MuiTextEditor.js';

export const muiStandardRules: Array<ModelMatcherRule<Editor, Model<unknown>>> =
    [
        {
            matches: Rule.type(RigidObjectDefinition),
            result: MuiRigidObjectEditor,
            priority: 0,
        },
        {
            matches: Rule.type(StringDefinition),
            result: MuiTextEditor,
            priority: 0,
        },
    ];
