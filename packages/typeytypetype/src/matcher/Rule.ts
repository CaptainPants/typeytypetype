import { type Definition } from '../definitions';
import { type MatcherRulePart, type Selector } from './types.js';

function flatten(part: MatcherRulePart | MatcherRulePart[]): MatcherRulePart {
    return Array.isArray(part) ? { type: 'and', rules: part } : part;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Rule {
    export function label(label: string): MatcherRulePart {
        return {
            type: 'label',
            label,
        };
    }

    export function attr(name: string, value: unknown): MatcherRulePart {
        return {
            type: 'attr',
            name,
            value,
        };
    }

    export function type(
        constructor: new (...args: unknown[]) => Definition<unknown>
    ): MatcherRulePart {
        return {
            type: 'type',
            constructor,
        };
    }

    export function element(
        match: MatcherRulePart = { type: 'any' }
    ): MatcherRulePart {
        return {
            type: 'element',
            match,
        };
    }

    export function propertyOf(
        propertyName?: string,
        match: MatcherRulePart = { type: 'any' }
    ): MatcherRulePart {
        return {
            type: 'propertyOf',
            propertyName,
            match,
        };
    }

    export function ancestor(
        match: MatcherRulePart = { type: 'any' }
    ): MatcherRulePart {
        return {
            type: 'ancestor',
            match,
        };
    }

    export function and(args: MatcherRulePart[]): MatcherRulePart {
        return {
            type: 'and',
            rules: args,
        };
    }

    export function or(args: MatcherRulePart[]): MatcherRulePart {
        return {
            type: 'or',
            rules: args,
        };
    }

    export function selector(...[top, ...rest]: Selector): MatcherRulePart {
        let current = top;

        for (const step of rest) {
            if ('$element' in step) {
                current = {
                    type: 'and',
                    rules: [
                        {
                            type: 'element',
                            match: current,
                        },
                        flatten(step.$element),
                    ],
                };
            } else if ('$property' in step) {
                current = {
                    type: 'and',
                    rules: [
                        {
                            type: 'propertyOf',
                            propertyName: step.propertyName,
                            match: current,
                        },
                        flatten(step.$property),
                    ],
                };
            } else if ('$descendent' in step) {
                current = {
                    type: 'and',
                    rules: [
                        {
                            type: 'ancestor',
                            match: current,
                        },
                        flatten(step.$descendent),
                    ],
                };
            }
        }

        return current;
    }
}
