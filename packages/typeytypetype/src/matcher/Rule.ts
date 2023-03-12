import { type Definition } from '../definitions';
import { type ModelMatcherRulePart } from './types.js';

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
}
