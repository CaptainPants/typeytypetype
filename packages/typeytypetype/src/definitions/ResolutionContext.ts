import { Definition } from './Definition.js';

export interface ResolutionContext {
    getDefinitionFromName: (name: string) => Definition<unknown>;
}
