export abstract class Model<T> {
  abstract toTypeString (): string

  /**
   * This is 100% here just to allow type inference to match the type.
   * @returns
   */
  differentiator (): T | undefined {
    return undefined
  }
}
