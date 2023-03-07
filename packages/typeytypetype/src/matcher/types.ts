import { type Definition } from '../definitions/Definition.js';
import { type Model } from '../models/Model.js';

export type SelectorStep<TRulePart> =
    | {
          $element: TRulePart | TRulePart[];
      }
    | {
          $property: TRulePart | TRulePart[];
          propertyName?: string | undefined;
      }
    | {
          $descendent: TRulePart | TRulePart[];
      };

export type Selector<TModelMatcherRulePart> = [
    top: TModelMatcherRulePart,
    ...rest: Array<SelectorStep<TModelMatcherRulePart>>
];

export type ModelMatcherRulePart =
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
          match: ModelMatcherRulePart;
      }
    | {
          type: 'propertyOf';
          propertyName?: string | undefined;
          match: ModelMatcherRulePart;
      }
    | {
          type: 'ancestor';
          match: ModelMatcherRulePart;
      }
    | {
          type: 'or';
          rules: ModelMatcherRulePart[];
      }
    | {
          type: 'and';
          rules: ModelMatcherRulePart[];
      }
    | {
          type: 'callback';
          callback: (model: Model<unknown>) => boolean;
      };

export interface ModelMatcherRule<TResult> {
    name?: string;
    matches: ModelMatcherRulePart;
    priority: number;
    result: TResult;
}
