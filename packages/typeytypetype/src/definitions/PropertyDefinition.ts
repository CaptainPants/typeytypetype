import { type Definition } from './Definition.js';

export class PropertyDefinition<TType> {
    constructor(type: Definition<TType>) {
        this.type = type;
    }

    public displayName?: string;
    public category?: string;
    public type: Definition<TType>;

    public withDisplayName(displayName: string): this {
        this.displayName = displayName;
        return this;
    }

    public withCategory(category: string): this {
        this.category = category;
        return this;
    }
}
