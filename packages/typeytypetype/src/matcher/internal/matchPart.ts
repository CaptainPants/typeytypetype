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
    if ('$attr' in part) {
        return deepEqual(
            part.value,
            model.unknownDefinition.getAttribute(part.$attr)
        );
    } else if ('$label' in part) {
        return model.unknownDefinition.hasLabel(part.$label);
    } else if ('$class' in part) {
        return model.unknownDefinition.constructor === part.$class;
    } else if ('$or' in part) {
        return or(part.$or, (item) => matchPart(model, item, descend(depth)));
    } else if ('$and' in part) {
        return and(part.$and, (item) => matchPart(model, item, descend(depth)));
    } else if ('$parent' in part) {
        const parent = model.parent?.model;
        if (parent === undefined) {
            return false;
        }
        return matchPart(parent, part.$parent, descend(depth));
    } else if ('$ancestor' in part) {
        return (
            traverseAncestors(model, (node) =>
                matchPart(node, part.$ancestor, descend(depth))
            ) != null
        );
    } else if ('$callback' in part) {
        return part.$callback(model.unknownDefinition);
    }

    throw new Error('Unexpected');
}
