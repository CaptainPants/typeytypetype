import { Model } from './Model';

export class SimpleModel<
    T extends string | number | boolean | undefined | null
> extends Model<T> {}
