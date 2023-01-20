import { MappedModel } from '../internal/utilityTypes'
import { Model } from './Model'

export class UnionModel<TTypes extends readonly unknown[]> extends Model<
TTypes[number]
> {
  constructor (models: MappedModel<TTypes>) {
    super()
    this.#models = models
  }

  #models: MappedModel<TTypes>

  toTypeString (): string {
    return this.#models.map((item) => `(${item.toTypeString()}})`).join(' | ')
  }
}
