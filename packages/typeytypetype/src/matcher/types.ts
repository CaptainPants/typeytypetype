import { type Definition } from '../definitions/Definition.js';

export type MatcherRulePart =
    | {
          type: 'definition';
          classConstructor: new (...args: unknown[]) => Definition<unknown>;
      }
    | {
          type: 'label';
          label: string;
      }
    | {
          type: 'attr';
          name: string;
          value: unknown;
      }
    | {
          type: 'logical';
          op: 'or' | 'and';
          operands: MatcherRulePart[];
      };

export interface MatcherRule<T> {
    name: string;
    parts: MatcherRulePart[];
    priority: number;
    result: T;
}
