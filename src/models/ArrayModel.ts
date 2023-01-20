import { Model } from './Model'

export class ArrayModel<TItemType> extends Model<TItemType[]> {
  constructor (itemModel: Model<TItemType>) {
    super()
    this.#itemModel = itemModel
  }

  #itemModel: Model<TItemType>

  override toTypeString (): string {
    return `Array<${this.#itemModel.toTypeString()}>`
  }
}
