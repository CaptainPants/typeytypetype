import { type Definition } from '../definitions/Definition.js';

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

export type ModelMatcherRulePart<TModel> =
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
          match: ModelMatcherRulePart<TModel>;
      }
    | {
          type: 'propertyOf';
          propertyName?: string | undefined;
          match: ModelMatcherRulePart<TModel>;
      }
    | {
          type: 'ancestor';
          match: ModelMatcherRulePart<TModel>;
      }
    | {
          type: 'or';
          rules: Array<ModelMatcherRulePart<TModel>>;
      }
    | {
          type: 'and';
          rules: Array<ModelMatcherRulePart<TModel>>;
      }
    | {
          type: 'callback';
          callback: (model: TModel) => boolean;
      };

export interface ModelMatcherRule<TResult, TModel> {
    name?: string;
    matches: ModelMatcherRulePart<TModel>;
    priority: number;
    result: TResult;
}
