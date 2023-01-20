import { Model } from './models/Model';

export interface ResolutionContext {
    getModelFromName: (name: string) => Model<unknown>;
}
