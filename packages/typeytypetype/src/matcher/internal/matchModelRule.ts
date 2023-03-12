import { deepEqual } from 'fast-equals';
import { type DefinitionNode } from '../../definitions/types.js';

import { descend } from '../../internal/descend.js';
import { and, or } from '../../internal/logical.js';
import { type ModelMatcherRule, type ModelMatcherRulePart } from '../types.js';

function traverseAncestors(
    node: DefinitionNode,
    predicate: (node: DefinitionNode) => boolean
): DefinitionNode | undefined {
    let current = node.parent;
    while (current !== undefined) {
        if (predicate(current)) {
            return current;
        }

        current = current.parent;
    }

    return undefined;
}

export function matchDefinitionRule<TResult>(
    model: DefinitionNode,
    part: ModelMatcherRule<TResult>,
    depth = 25
): boolean {
    return matchDefinitionRulePart(model, part.matches, depth);
}

export function matchDefinitionRulePart(
    node: DefinitionNode,
    part: ModelMatcherRulePart,
    depth = 25
): boolean {
    switch (part.type) {
        case 'attr':
            return deepEqual(
                part.value,
                node.definition.getAttribute(part.name)
            );
        case 'label':
            return node.definition.hasLabel(part.label);
        case 'type':
            return node.constructor === part.constructor;
        case 'or':
            return or(part.rules, (item) =>
                matchDefinitionRulePart(node, item, descend(depth))
            );
        case 'and':
            return and(part.rules, (item) =>
                matchDefinitionRulePart(node, item, descend(depth))
            );
        case 'propertyOf':
            if (node.parent?.relationship.type !== 'property') {
                return false;
            }
            if (
                typeof part.propertyName !== 'undefined' &&
                part.propertyName !== node.parent.relationship.property
            ) {
                return false;
            }
            return matchDefinitionRulePart(
                node.parent,
                part.match,
                descend(depth)
            );
        case 'element':
            if (node.parent?.relationship.type !== 'element') {
                return false;
            }
            return matchDefinitionRulePart(
                node.parent,
                part.match,
                descend(depth)
            );
        case 'ancestor':
            return (
                traverseAncestors(node, (item) =>
                    matchDefinitionRulePart(item, part.match, descend(depth))
                ) !== null
            );
        case 'callback':
            return part.callback(node.definition);
    }

    throw new Error('Unexpected');
}
