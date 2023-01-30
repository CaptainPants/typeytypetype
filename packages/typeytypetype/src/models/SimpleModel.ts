import { Model } from './Model';

export abstract class SimpleModel<
    T extends string | number | boolean | Date | undefined | null
> extends Model<T> {}

export class NumberModel extends SimpleModel<number> {}
export class StringModel extends SimpleModel<string> {}
export class BooleanModel extends SimpleModel<boolean> {}
export class DateModel extends SimpleModel<string> {}
export class NullModel extends SimpleModel<null> {}
export class UndefinedModel extends SimpleModel<undefined> {}
