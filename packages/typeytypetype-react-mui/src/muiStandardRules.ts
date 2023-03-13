import {
    type TypeMatcherRule,
    RigidObjectType,
    Rules,
    StringType,
} from '@captainpants/typeytypetype';
import { type Editor } from '@captainpants/typeytypetype-react';
import { MuiRigidObjectEditor } from './editors/MuiRigidObjectEditor.js';
import { MuiTextEditor } from './editors/MuiTextEditor.js';

export const muiStandardRules: Array<TypeMatcherRule<Editor>> = [
    {
        matches: Rules.type(RigidObjectType),
        result: MuiRigidObjectEditor,
        priority: 0,
    },
    {
        matches: Rules.type(StringType),
        result: MuiTextEditor,
        priority: 0,
    },
];
