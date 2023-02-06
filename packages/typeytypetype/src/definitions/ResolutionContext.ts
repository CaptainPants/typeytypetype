import { Definition } from './Definition';

export interface ResolutionContext {
    getDefinitionFromName: (name: string) => Definition<unknown>;
}
