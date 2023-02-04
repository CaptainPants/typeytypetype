import { Definition } from '../definitions/Definition';
import { Replacer } from '../types';
import { Model } from './Model';
import { ModelBase } from './ModelBase';
import { ModelFactory } from './ModelFactory';

type SimpleType = string | number | boolean | Date | undefined | null;
type SimpleConstructor<T extends SimpleType> = new (value: T, definition: Definition<T>, replace: Replacer<T>, depth: number, factory: ModelFactory) => SimpleModel<T>;

export abstract class SimpleModel<
    T extends SimpleType
> extends ModelBase<T> {
    override clone(replace: Replacer<T>): Model<T> {
        const Constructor = (this.constructor as (SimpleConstructor<T>));
        return new Constructor(
            this.value, 
            this.definition, 
            replace, 
            this.depth, 
            this.factory
        );
    }
}

export class NumberModel extends SimpleModel<number> {}
export class StringModel extends SimpleModel<string> {}
export class BooleanModel extends SimpleModel<boolean> {}
export class DateModel extends SimpleModel<string> {}
export class NullModel extends SimpleModel<null> {}
export class UndefinedModel extends SimpleModel<undefined> {}
