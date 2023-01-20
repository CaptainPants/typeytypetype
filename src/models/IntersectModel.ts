import { MappedModel, UnionToIntersection } from '../internal/utilityTypes'
import { TypeFromModel } from '../types'
import { Model } from './Model'

export class IntersectModel<TTypes extends readonly unknown[]> extends Model<
UnionToIntersection<TypeFromModel<TTypes[number]>>
> {
  constructor (models: MappedModel<TTypes>) {
    super()
    this.#models = models
  }

  #models: MappedModel<TTypes>

  toTypeString (): string {
    return this.#models.map((item) => `(${item.toTypeString()}})`).join(' & ')
  }
}
