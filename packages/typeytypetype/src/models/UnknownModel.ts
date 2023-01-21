import { ResolutionContext } from '../ResolutionContext.js';
import { Model } from './Model.js';

export class UnknownModel extends Model<unknown> {
    doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return true;
    }

    doToTypeString(depth: number): string {
        return 'unknown';
    }
}
