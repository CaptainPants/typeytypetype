import { type Type } from './Type.js';

export class PropertyDefinition<TType> {
    constructor(type: Type<TType>) {
        this.type = type;
    }

    public displayName?: string;
    public category?: string;
    public type: Type<TType>;

    public withDisplayName(displayName: string): this {
        this.displayName = displayName;
        return this;
    }

    public withCategory(category: string): this {
        this.category = category;
        return this;
    }
}
