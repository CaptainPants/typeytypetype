import { type Definition } from '../definitions/Definition.js';
import { and } from '../internal/logical.js';
import { type Model } from '../models/Model.js';
import { matchPart } from './internal/matchPart.js';
import { type MatcherRule } from './types.js';

export class Matcher<T> {
    constructor(rules: Array<MatcherRule<T>>) {
        this.rules = rules;
    }

    public readonly rules: Array<MatcherRule<T>>;

    public findMatch<TValue>(model: Model<TValue>): MatcherRule<T> | null {
        let bestCandidateRule: MatcherRule<T> | null = null;

        for (const rule of this.rules) {
            const currentMatches = this.#doesMatch(model, rule);

            if (
                currentMatches &&
                (bestCandidateRule === null ||
                    bestCandidateRule.priority < rule.priority)
            ) {
                bestCandidateRule = rule;
            }
        }

        return bestCandidateRule;
    }

    #doesMatch<TValue>(model: Model<TValue>, rule: MatcherRule<T>): boolean {
        // model is a complicated type so definition gets typed a bit weirdly
        const definition = model.definition as Definition<TValue>;

        return and(rule.parts, (part) => matchPart(definition, part));
    }
}
