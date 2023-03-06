import { EditorRules } from '@captainpants/typeytypetype-react';
import React, { type ReactElement } from 'react';
import { muiStandardRules } from './muiStandardRules.js';

export interface MuiStandardEditorRulesProps {
    children?: ReactElement;
}

export function MuiStandardEditorRules(
    props: Readonly<MuiStandardEditorRulesProps>
): ReactElement;
export function MuiStandardEditorRules({
    children,
}: Readonly<MuiStandardEditorRulesProps>): ReactElement {
    return <EditorRules rules={muiStandardRules}>{children}</EditorRules>;
}
