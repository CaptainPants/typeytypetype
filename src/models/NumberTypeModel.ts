import { Model } from './Model'

export class NumberTypeModel extends Model<number> {
  override toTypeString (): string {
    return 'number'
  }
}
