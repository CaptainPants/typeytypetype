import { ResolutionContext } from '../ResolutionContext';
import { Model } from './Model';

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
