import { type PropertyDefinition } from '../definitions/PropertyDefinition.js';
import { type Model } from './Model.js';

export interface PropertyModel<TType> {
    readonly name: string;
    readonly definition: PropertyDefinition<TType>;
    readonly valueModel: Model<TType>;
}
