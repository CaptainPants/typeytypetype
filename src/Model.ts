import { TypeFromModel } from "./types";

export abstract class Model<T> {
  abstract toTypeString(): string;

  /**
   * This is 100% here just to allow type inference to match the type.
   * @returns
   */
  getExample(): T {
    throw "Not implemented.";
  }
}

export class ConstantModel<T> extends Model<T> {
  constructor(value: T) {
    super();
    this.#value = value;
  }

  #value: T;

  override toTypeString(): string {
    return JSON.stringify(this.#value);
  }
}

export class StringTypeModel<T> extends Model<string> {
  constructor() {
    super();
  }

  override toTypeString(): string {
    return "string";
  }
}

export class NumberTypeModel<T> extends Model<number> {
  constructor() {
    super();
  }

  override toTypeString(): string {
    return "number";
  }
}

export class BooleanTypeModel<T> extends Model<boolean> {
  constructor() {
    super();
  }

  override toTypeString(): string {
    return "boolean";
  }
}

export class ArrayModel<TItemType> extends Model<TItemType[]> {
  constructor(itemModel: Model<TItemType>) {
    super();
    this.#itemModel = itemModel;
  }

  #itemModel: Model<TItemType>;

  override toTypeString(): string {
    return `Array<${this.#itemModel.toTypeString()}>`;
  }
}
