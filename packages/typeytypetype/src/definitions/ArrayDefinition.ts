import { combineDefinitionPath } from '../internal/combineDefinitionPath.js';
import { descend } from '../internal/descend.js';
import { BaseDefinition } from './BaseDefinition.js';
import { type Definition } from './Definition.js';
import {
    type ValidationSingleResult,
    type ValidationOptions,
} from './Validator.js';

export class ArrayDefinition<TElement> extends BaseDefinition<TElement[]> {
    constructor(elementDefinition: Definition<TElement>) {
        super();
        this.elementDefinition = elementDefinition;
    }

    public readonly elementDefinition: Definition<TElement>;

    override doMatches(
        value: unknown,
        deep: boolean,
        depth: number
    ): value is TElement[] {
        if (!Array.isArray(value)) return false;

        if (!deep) {
            return true;
        }

        // Any item doesn't validate against #itemModel
        return (
            value.findIndex(
                (itemValue: unknown) =>
                    !this.elementDefinition.doMatches(
                        itemValue,
                        deep,
                        descend(depth)
                    )
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
    ): Promise<ValidationSingleResult[] | undefined> {
        const res: ValidationSingleResult[] = [];

        for (let i = 0; i < value.length; ++i) {
            const item = value[i];

            const itemResult = await this.elementDefinition.doValidate(
                item,
                options,
                descend(depth)
            );

            res.push(
                ...itemResult.map((item) => ({
                    path: combineDefinitionPath(i, item.path),
                    message: item.message,
                }))
            );
        }

        return res;
    }
}
