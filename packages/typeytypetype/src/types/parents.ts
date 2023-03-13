import { type Type } from './Type.js';

export type ParentRelationship =
    | {
          type: 'element';
      }
    | {
          type: 'property';
          property: string;
      }
    | {
          type: 'self';
      };

export interface DefinitionNode {
    type: Type<unknown>;
    parent?: ParentDefinitionNode | undefined;
}
export interface ParentDefinitionNode extends DefinitionNode {
    relationship: ParentRelationship;
}
