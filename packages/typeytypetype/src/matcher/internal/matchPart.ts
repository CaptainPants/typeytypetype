import { deepEqual } from 'fast-equals';

import { type Definition } from '../../definitions';
import { and, or } from '../../internal/logical.js';
import { type MatcherRulePart } from '../types.js';

export function matchPart<TValue>(
    definition: Definition<TValue>,
    part: MatcherRulePart
): boolean {
    if ('$attr' in part) {
        return deepEqual(part.value, definition.getAttribute(part.$attr));
    } else if ('$label' in part) {
        return definition.hasLabel(part.$label);
    } else if ('$class' in part) {
        return definition.constructor === part.$class;
    } else if ('$or' in part) {
        return or(part.$or, (item) => matchPart(definition, item));
    } else if ('$and' in part) {
        return and(part.$and, (item) => matchPart(definition, item));
    } else if ('$predicate' in part) {
        return part.$predicate(definition);
    }

    throw new Error('Unexpected');
}
