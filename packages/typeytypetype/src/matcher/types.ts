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
          $parent: MatcherRulePart;
      }
    | {
          $ancestor: MatcherRulePart;
      }
    | {
          $or: MatcherRulePart[];
      }
    | {
          $and: MatcherRulePart[];
      }
    | {
          $callback: (definition: Definition<unknown>) => boolean;
      };

export interface MatcherRule<T> {
    name: string;
    parts: MatcherRulePart[];
    priority: number;
    result: T;
}
