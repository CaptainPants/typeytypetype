import { ResolutionContext } from './ResolutionContext';

export function createResolutionContext(): ResolutionContext {
    return {
        getDefinitionFromName(name) {
            throw new Error('Not implemented');
        },
    };
}
