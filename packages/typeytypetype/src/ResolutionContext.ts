import { Definition } from './definitions/Definition.js';

export interface ResolutionContext {
    getModelFromName: (name: string) => Definition<unknown>;
}
