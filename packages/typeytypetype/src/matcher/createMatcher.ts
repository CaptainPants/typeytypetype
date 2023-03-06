import { type Model } from '../models';
import { matchModelRule } from './internal/matchModelRule.js';
import { Matcher } from './Matcher.js';
import { type ModelMatcherRule } from './types.js';

export function createModelMatcher<TResult>(
    rules: Array<ModelMatcherRule<TResult>>
): Matcher<ModelMatcherRule<TResult>, Model<unknown>> {
    return new Matcher<ModelMatcherRule<TResult>, Model<unknown>>(
        rules,
        matchModelRule
    );
}
