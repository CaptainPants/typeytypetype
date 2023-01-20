import { ResolutionContext } from '../ResolutionContext';
import { Model } from './Model';

export class NumberTypeModel extends Model<number> {
    override validate(
        resolutionContext: ResolutionContext,
        value: unknown
    ): boolean {
        return typeof value === 'number';
    }

    override toTypeString(): string {
        return 'number';
    }
}
