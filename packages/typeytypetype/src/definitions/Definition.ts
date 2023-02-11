export abstract class Definition<T> {
    matchesStructure(value: unknown): boolean {
        return this.doMatchesStructure(value, 25);
    }

    abstract doMatchesStructure(value: unknown, depth: number): boolean;

    async validate(value: unknown): Promise<boolean> {
        return await this.doValidate(value, 25);
    }

    async doValidate(value: unknown, depth: number): Promise<boolean> {
        return this.doMatchesStructure(value, depth);
    }

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
