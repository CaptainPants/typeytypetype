import { ResolutionContext } from '../ResolutionContext';
import { Model } from './Model';

export class BooleanTypeModel extends Model<boolean> {
    override validateImplementation(
        resolutionContext: ResolutionContext,
        value: unknown,
        _depth: number
    ): boolean {
        return typeof value === 'boolean';
    }

    override toTypeStringImplementation(depth: number): string {
        return 'boolean';
    }
}
