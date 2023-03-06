import { type Definition } from '../definitions';
import { type Model } from '../models';
import { type ModelMatcherRulePart, type Selector } from './types.js';

function flatten(
    part:
        | ModelMatcherRulePart<Model<unknown>>
        | Array<ModelMatcherRulePart<Model<unknown>>>
): ModelMatcherRulePart<Model<unknown>> {
    return Array.isArray(part) ? { type: 'and', rules: part } : part;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Rule {
    export function label(label: string): ModelMatcherRulePart<Model<unknown>> {
        return {
            type: 'label',
            label,
        };
    }

    export function attr(
        name: string,
        value: unknown
    ): ModelMatcherRulePart<Model<unknown>> {
        return {
            type: 'attr',
            name,
            value,
        };
    }

    export function type(
        constructor: new (...args: any[]) => Definition<any>
    ): ModelMatcherRulePart<Model<unknown>> {
        return {
            type: 'type',
            constructor,
        };
    }

    export function element(
        match: ModelMatcherRulePart<Model<unknown>> = { type: 'any' }
    ): ModelMatcherRulePart<Model<unknown>> {
        return {
            type: 'element',
            match,
        };
    }

    export function propertyOf(
        propertyName?: string,
        match: ModelMatcherRulePart<Model<unknown>> = { type: 'any' }
    ): ModelMatcherRulePart<Model<unknown>> {
        return {
            type: 'propertyOf',
            propertyName,
            match,
        };
    }

    export function ancestor(
        match: ModelMatcherRulePart<Model<unknown>> = { type: 'any' }
    ): ModelMatcherRulePart<Model<unknown>> {
        return {
            type: 'ancestor',
            match,
        };
    }

    export function and(
        args: Array<ModelMatcherRulePart<Model<unknown>>>
    ): ModelMatcherRulePart<Model<unknown>> {
        return {
            type: 'and',
            rules: args,
        };
    }

    export function or(
        args: Array<ModelMatcherRulePart<Model<unknown>>>
    ): ModelMatcherRulePart<Model<unknown>> {
        return {
            type: 'or',
            rules: args,
        };
    }

    export function selector(
        ...[top, ...rest]: Selector<ModelMatcherRulePart<Model<unknown>>>
    ): ModelMatcherRulePart<Model<unknown>> {
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
