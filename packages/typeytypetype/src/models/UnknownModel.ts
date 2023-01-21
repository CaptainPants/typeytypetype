import { ResolutionContext } from '../ResolutionContext.js';
import { Model } from './Model.js';

export class UnknownModel extends Model<unknown> {
    validateImplementation(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return true;
    }

    toTypeStringImplementation(depth: number): string {
        return 'unknown';
    }
}
