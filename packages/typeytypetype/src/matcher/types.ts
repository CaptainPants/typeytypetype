import { type ParentDefinitionNode } from '../types/parents.js';
import { type Type } from '../types/Type.js';

export type SelectorStep =
    | {
          $element: TypeMatcherRulePart | TypeMatcherRulePart[];
      }
    | {
          $property: TypeMatcherRulePart | TypeMatcherRulePart[];
          propertyName?: string | undefined;
      }
    | {
          $descendent: TypeMatcherRulePart | TypeMatcherRulePart[];
      };

export type Selector = [top: TypeMatcherRulePart, ...rest: SelectorStep[]];

export type TypeMatcherRulePart =
    | {
          type: 'any';
      }
    | {
          type: 'type';
          constructor: new (...args: unknown[]) => Type<unknown>;
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
          match: TypeMatcherRulePart;
      }
    | {
          type: 'propertyOf';
          propertyName?: string | undefined;
          match: TypeMatcherRulePart;
      }
    | {
          type: 'ancestor';
          match: TypeMatcherRulePart;
      }
    | {
          type: 'or';
          rules: TypeMatcherRulePart[];
      }
    | {
          type: 'and';
          rules: TypeMatcherRulePart[];
      }
    | {
          type: 'callback';
          callback: (
              type: Type<unknown>,
              parent: ParentDefinitionNode | undefined
          ) => boolean;
      };

export interface TypeMatcherRule<TResult> {
    name?: string;
    matches: TypeMatcherRulePart;
    priority: number;
    result: TResult;
}
