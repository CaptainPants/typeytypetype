import { type Definition } from '../definitions/Definition.js';
import { type Model } from '../models/Model.js';

export type SelectorStep =
    | { $element: MatcherRulePart | MatcherRulePart[] }
    | {
          $property: MatcherRulePart | MatcherRulePart[];
          propertyName?: string | undefined;
      }
    | { $descendent: MatcherRulePart | MatcherRulePart[] };

export type Selector = [top: MatcherRulePart, ...rest: SelectorStep[]];

export type MatcherRulePart =
    | {
          type: 'any';
      }
    | {
          type: 'type';
          constructor: new (...args: unknown[]) => Definition<unknown>;
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
          type: 'element';
          match: MatcherRulePart;
      }
    | {
          type: 'propertyOf';
          propertyName?: string | undefined;
          match: MatcherRulePart;
      }
    | {
          type: 'ancestor';
          match: MatcherRulePart;
      }
    | {
          type: 'or';
          rules: MatcherRulePart[];
      }
    | {
          type: 'and';
          rules: MatcherRulePart[];
      }
    | {
          type: 'callback';
          callback: (model: Model<unknown>) => boolean;
      };

export interface MatcherRule<T> {
    name?: string;
    matches: MatcherRulePart;
    priority: number;
    result: T;
}
