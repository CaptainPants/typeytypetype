import { Model } from './Model'

export class StringTypeModel extends Model<string> {
  override toTypeString (): string {
    return 'string'
  }
}
