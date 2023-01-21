import { Model } from './models/Model';
import { ArrayModel } from './models/ArrayModel';
import { NumberTypeModel } from './models/NumberTypeModel';
import { StringTypeModel } from './models/StringTypeModel';
import { ConstantModel } from './models/ConstantModel';
import { BooleanTypeModel } from './models/BooleanTypeModel';
import { UnionModel } from './models/UnionModel';
import { IntersectModel } from './models/IntersectModel';
import { ObjectModel } from './models/ObjectModel';
import { MappedModel } from './internal/utilityTypes';
import { DelegatedModel } from './models/DelegatedModel';

export const Type = {
    constant<TValue extends string | number | boolean>(
        value: TValue
    ): ConstantModel<TValue> {
        return new ConstantModel(value);
    },

    null() {
        return new ConstantModel(null);
    },

    undefined(): Model<undefined> {
        return new ConstantModel(undefined);
    },

    string(): StringTypeModel {
        return new StringTypeModel();
    },

    boolean(): BooleanTypeModel {
        return new BooleanTypeModel();
    },

    number(): NumberTypeModel {
        return new NumberTypeModel();
    },

    union<TTypes extends readonly unknown[]>(...models: MappedModel<TTypes>) {
        return new UnionModel(models);
    },

    intersect<TTypes extends readonly unknown[]>(
        ...models: MappedModel<TTypes>
    ) {
        return new IntersectModel(models);
    },

    object<TPropertyTypes extends Record<string, unknown>>(
        propertyModels: MappedModel<TPropertyTypes>
    ) {
        return new ObjectModel(propertyModels);
    },

    array<IElementType>(
        itemModel: Model<IElementType>
    ): ArrayModel<IElementType> {
        return new ArrayModel(itemModel);
    },

    delegated<TType>(): DelegatedModel<TType> {
        return new DelegatedModel<TType>();
    },
};
