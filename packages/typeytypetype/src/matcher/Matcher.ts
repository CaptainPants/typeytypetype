import { and } from '../internal/logical.js';
import { type Model } from '../models/Model.js';
import { matchPart } from './internal/matchPart.js';
import { type MatcherRule } from './types.js';

export class Matcher<T> {
    constructor(rules: Array<MatcherRule<T>>) {
        this.rules = rules;
    }

    public readonly rules: Array<MatcherRule<T>>;

    public findSingleMatch(model: Model<unknown>): MatcherRule<T> | null {
        let bestCandidateRule: MatcherRule<T> | null = null;

        for (let i = this.rules.length - 1; i >= 0; --i) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const rule = this.rules[i]!;
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

    public findAllMatches(model: Model<unknown>): Array<MatcherRule<T>> | null {
        const matches: Array<[rule: MatcherRule<T>, index: number]> = [];

        for (let i = this.rules.length - 1; i >= 0; --i) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const rule = this.rules[i]!;
            if (this.#doesMatch(model, rule)) {
                matches.push([rule, i]);
            }
        }

        // This is supposed to be stable as of ECMSScript 2019 (According to MDN) but
        // in earlier versions of Chrome it wasn't and we want a reliable sort order
        // so including the index in the sort
        matches.sort(priorityDescendingThenIndexDescending);

        return matches.map(([rule, _index]) => rule);
    }

    #doesMatch(model: Model<unknown>, rule: MatcherRule<T>): boolean {
        return and(rule.parts, (part) => matchPart(model, part));
    }
}

type SortingMatch<T> = [rule: MatcherRule<T>, index: number];

function priorityDescendingThenIndexDescending<T>(
    [aRule, aIndex]: SortingMatch<T>,
    [bRule, bIndex]: SortingMatch<T>
): number {
    // Descending priority value
    if (aRule.priority > bRule.priority) {
        return -1;
    } else if (aRule.priority < bRule.priority) {
        return 1;
    } else {
        // Then in ascending index order
        return bIndex - aIndex;
    }
}
