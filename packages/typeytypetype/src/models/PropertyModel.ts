import { type PropertyDefinition } from '../types/PropertyDefinition.js';
import { type Model } from './Model.js';

export interface PropertyModel<TType> {
    readonly name: string;
    readonly definition: PropertyDefinition<TType>;
    readonly valueModel: Model<TType>;
}
