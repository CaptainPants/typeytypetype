import { and } from '../internal/logical.js';
import { type Model } from '../models/Model.js';
import { matchPart } from './internal/matchPart.js';
import { type MatcherRule } from './types.js';

export class Matcher<T> {
    constructor(rules: Array<MatcherRule<T>>) {
        this.rules = rules;
    }

    public readonly rules: Array<MatcherRule<T>>;

    public findMatch(model: Model<unknown>): MatcherRule<T> | null {
        let bestCandidateRule: MatcherRule<T> | null = null;

        for (const rule of this.rules) {
            if (
                (bestCandidateRule === null ||
                    bestCandidateRule.priority < rule.priority) &&
                this.#doesMatch(model, rule)
            ) {
                bestCandidateRule = rule;
            }
        }

        return bestCandidateRule;
    }

    #doesMatch(model: Model<unknown>, rule: MatcherRule<T>): boolean {
        return and(rule.parts, (part) => matchPart(model, part));
    }
}
