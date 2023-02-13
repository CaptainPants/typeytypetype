import { type BaseDefinition } from './BaseDefinition.js';

export interface ResolutionContext {
    getDefinitionFromName: (name: string) => BaseDefinition<unknown>;
}
