import { type DefinitionNode } from '../definitions/types.js';
import { matchDefinitionRule } from './internal/matchModelRule.js';
import { Matcher } from './Matcher.js';
import { type ModelMatcherRule } from './types.js';

export function createDefinitionMatcher<TResult>(
    rules: Array<ModelMatcherRule<TResult>>
): Matcher<ModelMatcherRule<TResult>, DefinitionNode> {
    return new Matcher<ModelMatcherRule<TResult>, DefinitionNode>(
        rules,
        matchDefinitionRule
    );
}
