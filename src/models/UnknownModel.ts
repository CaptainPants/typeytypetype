import { ResolutionContext } from '../ResolutionContext';
import { Model } from './Model';

export class UnknownModel extends Model<unknown> {
    validate(resolutionContext: ResolutionContext, value: unknown): boolean {
        return true;
    }

    toTypeString(): string {
        return 'unknown';
    }
}
