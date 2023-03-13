import { type DefinitionNode } from '../types/parents.js';
import { matchDefinitionRule } from './internal/matchModelRule.js';
import { Matcher } from './Matcher.js';
import { type TypeMatcherRule } from './types.js';

export function createTypeMatcher<TResult>(
    rules: Array<TypeMatcherRule<TResult>>
): Matcher<TypeMatcherRule<TResult>, DefinitionNode> {
    return new Matcher<TypeMatcherRule<TResult>, DefinitionNode>(
        rules,
        matchDefinitionRule
    );
}
