import { Model } from './Model'

export class ConstantModel<T> extends Model<T> {
  constructor (value: T) {
    super()
    this.#value = value
  }

  #value: T

  override toTypeString (): string {
    return JSON.stringify(this.#value)
  }
}
