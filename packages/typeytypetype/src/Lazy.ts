export class Lazy<T> {
    constructor(factory: () => T) {
        this.#factory = factory;
        this.#hasValue = false;
        this.#value = undefined;
    }

    #factory: () => T;
    #hasValue: boolean;
    #value: T | undefined;

    get value(): T {
        if (!this.#hasValue) {
            this.#value = this.#factory();
            this.#hasValue = true;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- undefined might be part of signature so can't check for it
        return this.#value!;
    }
}
