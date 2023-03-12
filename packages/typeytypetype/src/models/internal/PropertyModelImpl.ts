import { type PropertyDefinition } from '../../definitions/PropertyDefinition.js';
import { type Model, type PropertyModel } from '../Model.js';

export class PropertyModelImpl<TType> implements PropertyModel<TType> {
    constructor(
        name: string,
        definition: PropertyDefinition<TType>,
        valueModel: Model<TType>
    ) {
        this.name = name;
        this.definition = definition;
        this.valueModel = valueModel;
    }

    readonly name: string;
    readonly definition: PropertyDefinition<TType>;
    readonly valueModel: Model<TType>;
}