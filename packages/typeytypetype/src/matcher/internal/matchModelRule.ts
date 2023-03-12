import { deepEqual } from 'fast-equals';

import { descend } from '../../internal/descend.js';
import { and, or } from '../../internal/logical.js';
import { type Model } from '../../models';
import { type ModelMatcherRule, type ModelMatcherRulePart } from '../types.js';

export function matchModelRule<TResult>(
    model: Model<unknown>,
    part: ModelMatcherRule<TResult>,
    depth = 25
): boolean {
    return matchModelRulePart(model, part.matches, depth);
}

export function matchModelRulePart(
    model: Model<unknown>,
    part: ModelMatcherRulePart,
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
                matchModelRulePart(model, item, descend(depth))
            );
        case 'and':
            return and(part.rules, (item) =>
                matchModelRulePart(model, item, descend(depth))
            );
        case 'callback':
            return part.callback(model);
    }

    throw new Error('Unexpected');
}
