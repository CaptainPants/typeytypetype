import { type Definition } from './Definition.js';

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
    definition: Definition<unknown>;
    parent?: ParentDefinitionNode | undefined;
}
export interface ParentDefinitionNode extends DefinitionNode {
    relationship: ParentRelationship;
}
