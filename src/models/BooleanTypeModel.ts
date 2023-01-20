import { ResolutionContext } from '../ResolutionContext';
import { Model } from './Model';

export class BooleanTypeModel extends Model<boolean> {
    override validate(
        resolutionContext: ResolutionContext,
        value: unknown
    ): boolean {
        return typeof value === 'boolean';
    }

    override toTypeString(): string {
        return 'boolean';
    }
}
