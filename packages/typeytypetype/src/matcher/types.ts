import { type Definition } from '../definitions/Definition.js';
import { type Model } from '../models/Model.js';

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
