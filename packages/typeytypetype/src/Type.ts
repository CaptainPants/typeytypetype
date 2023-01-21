import { Model } from './models/Model.js';
import { ArrayModel } from './models/ArrayModel.js';
import { NumberTypeModel } from './models/NumberTypeModel.js';
import { StringTypeModel } from './models/StringTypeModel.js';
import { ConstantModel } from './models/ConstantModel.js';
import { BooleanTypeModel } from './models/BooleanTypeModel.js';
import { UnionModel } from './models/UnionModel.js';
import { IntersectModel } from './models/IntersectModel.js';
import { ObjectModel } from './models/ObjectModel.js';
import { MappedModel } from './internal/utilityTypes.js';
import { NamedDataModel } from './models/NamedDataModel.js';

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

    named<TType>(name: string): NamedDataModel<TType> {
        return new NamedDataModel<TType>(name);
    },
};
