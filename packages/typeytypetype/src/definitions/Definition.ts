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
     * This is 100% here just to allow type inference to match the type.
     * @returns
     */
    differentiator(): T {
        throw new Error('Do not call this method.');
    }
}
