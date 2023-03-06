import {
    type MatcherRule,
    RigidObjectDefinition,
    Rule,
    StringDefinition,
} from '@captainpants/typeytypetype';
import { type EditorProps } from '@captainpants/typeytypetype-react';
import { type ComponentType } from 'react';
import { MuiRigidObjectEditor } from './editors/MuiRigidObjectEditor.js';
import { MuiTextEditor } from './editors/MuiTextEditor.js';

export const rules: Array<MatcherRule<ComponentType<EditorProps>>> = [
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
