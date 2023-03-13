import { combineTypeDefinitionPath } from '../internal/combineTypeDefinitionPath.js';
import { descend } from '../internal/descend.js';
import { BaseType } from './BaseType.js';
import { type Type } from './Type.js';
import {
    type ValidationSingleResult,
    type ValidationOptions,
} from '../validation/types.js';

export class ArrayType<TElement> extends BaseType<TElement[]> {
    constructor(elementDefinition: Type<TElement>) {
        super();
        this.#elementType = elementDefinition;
    }

    #elementType: Type<TElement>;

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
                    !this.#elementType.doMatches(
                        itemValue,
                        deep,
                        descend(depth)
                    )
            ) < 0
        );
    }

    override doToTypeString(depth: number): string {
        return `Array<${this.#elementType.doToTypeString(
            descend(depth)
        )}>`;
    }

    getElementType(): Type<TElement> {
        return this.#elementType;
    }

    protected override async doValidateChildren(
        value: TElement[],
        options: ValidationOptions,
        depth: number
    ): Promise<ValidationSingleResult[] | undefined> {
        const res: ValidationSingleResult[] = [];

        for (let i = 0; i < value.length; ++i) {
            const item = value[i];

            const itemResult = await this.#elementType.doValidate(
                item,
                options,
                descend(depth)
            );

            res.push(
                ...itemResult.map((item) => ({
                    path: combineTypeDefinitionPath(i, item.path),
                    message: item.message,
                }))
            );
        }

        return res;
    }
}
