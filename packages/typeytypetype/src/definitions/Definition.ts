import { ResolutionContext } from '../ResolutionContext.js';

export abstract class Definition<T> {
    validate(resolutionContext: ResolutionContext, value: unknown): boolean {
        return this.doValidate(resolutionContext, value, 25);
    }

    abstract doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean;

    toTypeString(): string {
        return this.doToTypeString(25);
    }

    abstract doToTypeString(depth: number): string;

    /**
     * Returns the definition for array elements, or undefined if not supported.
     * @param value
     * @returns
     */
    arrayElementDefinition(value: number): Definition<unknown> | undefined {
        return undefined;
    }

    /**
     * Returns the definitoin of expando properties (used for RecordTypeDefinition).
     * Otherwise undefined if not supported.
     * @returns
     */
    expandoPropertyType(): Definition<unknown> | undefined {
        return undefined;
    }

    fixedPropertyDefinition(key: string): Definition<unknown> | undefined {
        return undefined;
    }

    /**
     * This is 100% here just to allow type inference to match the type.
     * @returns
     */
    differentiator(): T {
        throw new Error('Do not call this method.');
    }
}
