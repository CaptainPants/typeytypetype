import { type Type } from '../types/index.js';
import { type TypeMatcherRulePart } from './types.js';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Rules {
    export function label(label: string): TypeMatcherRulePart {
        return {
            type: 'label',
            label,
        };
    }

    export function attr(name: string, value: unknown): TypeMatcherRulePart {
        return {
            type: 'attr',
            name,
            value,
        };
    }

    export function type(
        constructor: new (...args: any[]) => Type<any>
    ): TypeMatcherRulePart {
        return {
            type: 'type',
            constructor,
        };
    }

    export function element(
        match: TypeMatcherRulePart = { type: 'any' }
    ): TypeMatcherRulePart {
        return {
            type: 'element',
            match,
        };
    }

    export function propertyOf(
        propertyName?: string,
        match: TypeMatcherRulePart = { type: 'any' }
    ): TypeMatcherRulePart {
        return {
            type: 'propertyOf',
            propertyName,
            match,
        };
    }

    export function ancestor(
        match: TypeMatcherRulePart = { type: 'any' }
    ): TypeMatcherRulePart {
        return {
            type: 'ancestor',
            match,
        };
    }

    export function and(args: TypeMatcherRulePart[]): TypeMatcherRulePart {
        return {
            type: 'and',
            rules: args,
        };
    }

    export function or(args: TypeMatcherRulePart[]): TypeMatcherRulePart {
        return {
            type: 'or',
            rules: args,
        };
    }
}
