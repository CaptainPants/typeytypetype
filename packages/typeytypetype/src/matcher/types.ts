import { type Definition } from '../definitions/Definition.js';

export type MatcherRulePart =
    | {
          $class: new (...args: unknown[]) => Definition<unknown>;
      }
    | {
          $label: string;
      }
    | {
          $attr: string;
          value: unknown;
      }
    | {
          $or: MatcherRulePart[];
      }
    | {
          $and: MatcherRulePart[];
      }
    | {
          $predicate: (definition: Definition<unknown>) => boolean;
      };

export interface MatcherRule<T> {
    name: string;
    parts: MatcherRulePart[];
    priority: number;
    result: T;
}
