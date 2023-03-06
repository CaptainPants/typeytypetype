import { type Model } from '../models';
import { matchModelRule } from './internal/matchModelRule.js';
import { Matcher } from './Matcher.js';
import { type ModelMatcherRule } from './types.js';

export function createModelMatcher<TResult>(
    rules: Array<ModelMatcherRule<TResult, Model<unknown>>>
): Matcher<ModelMatcherRule<TResult, Model<unknown>>, Model<unknown>> {
    return new Matcher<
        ModelMatcherRule<TResult, Model<unknown>>,
        Model<unknown>
    >(rules, matchModelRule);
}

// TODO: multiple version
