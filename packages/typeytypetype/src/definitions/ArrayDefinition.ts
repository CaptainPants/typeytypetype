import { descend } from '../internal/descend.js';
import { BaseDefinition } from './BaseDefinition.js';
import { type Definition } from './Definition.js';
import { type ValidationOptions } from './Validator.js';

export class ArrayDefinition<TElement> extends BaseDefinition<TElement[]> {
    constructor(elementDefinition: Definition<TElement>) {
        super();
        this.elementDefinition = elementDefinition;
    }

    public readonly elementDefinition: Definition<TElement>;

    override doMatches(value: unknown, depth: number): value is TElement[] {
        if (!Array.isArray(value)) return false;

        // Any item doesn't validate against #itemModel
        return (
            value.findIndex(
                (itemValue: unknown) =>
                    !this.elementDefinition.doMatches(itemValue, descend(depth))
            ) < 0
        );
    }

    override doToTypeString(depth: number): string {
        return `Array<${this.elementDefinition.doToTypeString(
            descend(depth)
        )}>`;
    }

    getElementDefinition(): Definition<TElement> {
        return this.elementDefinition;
    }

    protected override async doValidateChildren(
        value: TElement[],
        options: ValidationOptions,
        depth: number
    ): Promise<string[] | undefined> {
        const res: string[] = [];

        for (const item of value) {
            const itemResult = await this.elementDefinition.doValidate(
                item,
                options,
                descend(depth)
            );

            res.push(...itemResult);
        }

        return res;
    }
}
