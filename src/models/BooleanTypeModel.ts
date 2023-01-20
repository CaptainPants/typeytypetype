import { Model } from './Model';

export class BooleanTypeModel extends Model<boolean> {
    override toTypeString(): string {
        return 'boolean';
    }
}
