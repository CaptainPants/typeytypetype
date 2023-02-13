import { deepEqual } from 'fast-equals';

import { type Definition } from '../../definitions';
import { and, or } from '../../internal/logical.js';
import { type MatcherRulePart } from '../types.js';

export function matchPart<TValue>(
    definition: Definition<TValue>,
    part: MatcherRulePart
): boolean {
    switch (part.type) {
        case 'attr':
            return deepEqual(part.value, definition.attributes[part.name]);
        case 'label':
            return definition.labels.includes(part.label);
        case 'definition':
            return definition.constructor === part.classConstructor;
        case 'logical':
            if (part.op === 'and') {
                return and(part.operands, (item) =>
                    matchPart(definition, item)
                );
            } else if (part.op === 'or') {
                return or(part.operands, (item) => matchPart(definition, item));
            } else {
                throw new Error('Unexpected');
            }
    }
}
