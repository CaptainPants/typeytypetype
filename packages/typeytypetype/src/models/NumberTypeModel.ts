import { ResolutionContext } from '../ResolutionContext.js';
import { Model } from './Model.js';

export class NumberTypeModel extends Model<number> {
    override doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return typeof value === 'number';
    }

    override doToTypeString(depth: number): string {
        return 'number';
    }
}
