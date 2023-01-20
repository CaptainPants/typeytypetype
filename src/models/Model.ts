import { ResolutionContext } from '../ResolutionContext';

export abstract class Model<T> {
    abstract validate(
        resolutionContext: ResolutionContext,
        value: unknown
    ): boolean;

    abstract toTypeString(): string;

    /**
     * This is 100% here just to allow type inference to match the type.
     * @returns
     */
    differentiator(): T {
        throw new Error('Do not call this method.');
    }
}
