import { type ResolutionContext } from './ResolutionContext.js';

export function createResolutionContext(): ResolutionContext {
    return {
        getDefinitionFromName(name) {
            throw new Error('Not implemented');
        },
    };
}
