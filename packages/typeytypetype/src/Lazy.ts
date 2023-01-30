export class Lazy<T> {
    constructor(factory: () => T) {
        this.#factory = factory;
        this.#hasValue = false;
        this.#value = undefined;
    }

    #factory: () => T;
    #hasValue: boolean;
    #value: T | undefined;
    #error: unknown;

    get hasValue(): boolean {
        return this.#hasValue;
    }

    get value(): T {
        if (this.#error !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw this.#error;
        }

        if (!this.#hasValue) {
            this.#value = this.#factory();
            this.#hasValue = true;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- undefined might be part of signature so can't check for it
        return this.#value!;
    }

    get hasFaulted(): boolean {
        return this.#error !== undefined;
    }
}
