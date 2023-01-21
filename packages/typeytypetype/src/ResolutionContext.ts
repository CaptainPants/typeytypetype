import { Model } from './models/Model.js';

export interface ResolutionContext {
    getModelFromName: (name: string) => Model<unknown>;
}
