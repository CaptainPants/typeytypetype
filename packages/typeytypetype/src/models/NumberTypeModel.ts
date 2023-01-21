import { ResolutionContext } from '../ResolutionContext.js';
import { Model } from './Model.js';

export class NumberTypeModel extends Model<number> {
    override validateImplementation(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return typeof value === 'number';
    }

    override toTypeStringImplementation(depth: number): string {
        return 'number';
    }
}
