import { ResolutionContext } from '../ResolutionContext';
import { Model } from './Model';

export class StringTypeModel extends Model<string> {
    override validate(
        resolutionContext: ResolutionContext,
        value: unknown
    ): boolean {
        return typeof value === 'string';
    }

    override toTypeString(): string {
        return 'string';
    }
}
