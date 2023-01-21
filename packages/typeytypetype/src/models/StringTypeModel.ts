import { ResolutionContext } from '../ResolutionContext.js';
import { Model } from './Model.js';

export class StringTypeModel extends Model<string> {
    override validateImplementation(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return typeof value === 'string';
    }

    override toTypeStringImplementation(depth: number): string {
        return 'string';
    }
}
