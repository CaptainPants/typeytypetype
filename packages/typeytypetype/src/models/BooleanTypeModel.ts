import { ResolutionContext } from '../ResolutionContext.js';
import { Model } from './Model.js';

export class BooleanTypeModel extends Model<boolean> {
    override doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        _depth: number
    ): boolean {
        return typeof value === 'boolean';
    }

    override doToTypeString(depth: number): string {
        return 'boolean';
    }
}
