import { ResolutionContext } from './ResolutionContext';

export function createResolutionContext(): ResolutionContext {
    return {
        getModelFromName(name) {
            throw new Error('Not implemented');
        },
    };
}
