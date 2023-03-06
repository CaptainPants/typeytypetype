import { type Definition } from '../definitions';
import { type ModelMatcherRulePart, type Selector } from './types.js';

function flatten(
    part: ModelMatcherRulePart | ModelMatcherRulePart[]
): ModelMatcherRulePart {
    return Array.isArray(part) ? { type: 'and', rules: part } : part;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Rule {
    export function label(label: string): ModelMatcherRulePart {
        return {
            type: 'label',
            label,
        };
    }

    export function attr(name: string, value: unknown): ModelMatcherRulePart {
        return {
            type: 'attr',
            name,
            value,
        };
    }

    export function type(
        constructor: new (...args: any[]) => Definition<any>
    ): ModelMatcherRulePart {
        return {
            type: 'type',
            constructor,
        };
    }

    export function element(
        match: ModelMatcherRulePart = { type: 'any' }
    ): ModelMatcherRulePart {
        return {
            type: 'element',
            match,
        };
    }

    export function propertyOf(
        propertyName?: string,
        match: ModelMatcherRulePart = { type: 'any' }
    ): ModelMatcherRulePart {
        return {
            type: 'propertyOf',
            propertyName,
            match,
        };
    }

    export function ancestor(
        match: ModelMatcherRulePart = { type: 'any' }
    ): ModelMatcherRulePart {
        return {
            type: 'ancestor',
            match,
        };
    }

    export function and(args: ModelMatcherRulePart[]): ModelMatcherRulePart {
        return {
            type: 'and',
            rules: args,
        };
    }

    export function or(args: ModelMatcherRulePart[]): ModelMatcherRulePart {
        return {
            type: 'or',
            rules: args,
        };
    }

    export function selector(
        ...[top, ...rest]: Selector<ModelMatcherRulePart>
    ): ModelMatcherRulePart {
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
