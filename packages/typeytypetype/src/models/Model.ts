import { ResolutionContext } from '../ResolutionContext.js';

export abstract class Model<T> {
    validate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth = 25
    ): boolean {
        return this.validateImplementation(resolutionContext, value, depth);
    }

    abstract validateImplementation(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean;

    toTypeString(depth = 25): string {
        return this.toTypeStringImplementation(depth);
    }

    abstract toTypeStringImplementation(depth: number): string;

    /**
     * This is 100% here just to allow type inference to match the type.
     * @returns
     */
    differentiator(): T {
        throw new Error('Do not call this method.');
    }
}
