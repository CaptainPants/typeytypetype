import { type Model } from './Model.js';

export type ParentRelationship =
    | {
          type: 'element';
          index: number;
      }
    | {
          type: 'property';
          name: string;
      };

export interface ParentNode {
    relationship: ParentRelationship;
    model: Model<unknown>;
    parent: ParentNode | null;
}
