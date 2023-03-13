interface Rule {
    priority: number;
}

export class Matcher<TRule extends Rule, TTypeType> {
    constructor(
        rules: TRule[],
        match: (type: TTypeType, rule: TRule) => boolean
    ) {
        this.rules = rules;
        this.match = match;
    }

    public readonly rules: TRule[];
    public readonly match: (model: TTypeType, rule: TRule) => boolean;

    public findBestMatch(type: TTypeType): TRule | null {
        let bestCandidateRule: TRule | null = null;

        for (let i = this.rules.length - 1; i >= 0; --i) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const rule = this.rules[i]!;
            if (
                (bestCandidateRule === null ||
                    bestCandidateRule.priority < rule.priority) &&
                this.#doesMatch(type, rule)
            ) {
                bestCandidateRule = rule;
            }
        }

        return bestCandidateRule;
    }

    public findAllMatches(type: TTypeType): TRule[] {
        const matches: Array<[rule: TRule, index: number]> = [];

        for (let i = this.rules.length - 1; i >= 0; --i) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const rule = this.rules[i]!;
            if (this.#doesMatch(type, rule)) {
                matches.push([rule, i]);
            }
        }

        // This is supposed to be stable as of ECMSScript 2019 (According to MDN) but
        // in earlier versions of Chrome it wasn't and we want a reliable sort order
        // so including the index in the sort
        matches.sort(priorityDescendingThenIndexDescending);

        return matches.map(([rule, _index]) => rule);
    }

    #doesMatch(type: TTypeType, rule: TRule): boolean {
        return this.match(type, rule);
    }
}

type SortingMatch = [rule: Rule, index: number];

function priorityDescendingThenIndexDescending(
    [aRule, aIndex]: SortingMatch,
    [bRule, bIndex]: SortingMatch
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
