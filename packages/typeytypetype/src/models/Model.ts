import { ResolutionContext } from '../ResolutionContext.js';

export abstract class Model<T> {
    validate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth = 25
    ): boolean {
        return this.doValidate(resolutionContext, value, depth);
    }

    abstract doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean;

    toTypeString(depth = 25): string {
        return this.doToTypeString(depth);
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
