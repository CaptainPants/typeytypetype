import { deepEqual } from 'fast-equals';

import { descend } from '../../internal/descend.js';
import { and, or } from '../../internal/logical.js';
import { type UnknownModel, type Model } from '../../models';
import { type MatcherRulePart } from '../types.js';

function traverseAncestors(
    node: Model<unknown>,
    predicate: (node: Model<unknown>) => boolean
): Model<unknown> | null {
    let current = node.parent?.model ?? null;
    while (current !== null) {
        if (predicate(current)) {
            return current;
        }

        current = current.parent?.model ?? null;
    }

    return null;
}

export function matchPart(
    model: UnknownModel,
    part: MatcherRulePart,
    depth = 25
): boolean {
    switch (part.type) {
        case 'attr':
            return deepEqual(
                part.value,
                model.unknownDefinition.getAttribute(part.name)
            );
        case 'label':
            return model.unknownDefinition.hasLabel(part.label);
        case 'type':
            return model.unknownDefinition.constructor === part.constructor;
        case 'or':
            return or(part.rules, (item) =>
                matchPart(model, item, descend(depth))
            );
        case 'and':
            return and(part.rules, (item) =>
                matchPart(model, item, descend(depth))
            );
        case 'propertyOf':
            if (model.parent?.type !== 'property') {
                return false;
            }
            if (
                typeof part.propertyName !== 'undefined' &&
                part.propertyName !== model.parent.property
            ) {
                return false;
            }
            return matchPart(model.parent.model, part.match, descend(depth));
        case 'element':
            if (model.parent?.type !== 'element') {
                return false;
            }
            return matchPart(model.parent.model, part.match, descend(depth));
        case 'ancestor':
            return (
                traverseAncestors(model, (item) =>
                    matchPart(item, part.match, descend(depth))
                ) !== null
            );
        case 'callback':
            return part.callback(model);
    }

    throw new Error('Unexpected');
}
