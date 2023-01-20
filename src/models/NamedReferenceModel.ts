import { Model } from './Model';

/**
 * This is me attempting to experimentally support recursive structures. As we can't type inference in a circle,
 * this will have to just be unknown for the time being. I guess in practice the named type itself will have a
 * definition.
 */
export class NamedReferenceModel extends Model<unknown> {
    constructor(name: string) {
        super();
        this.#name = name;
    }

    #name: string;

    toTypeString(): string {
        return `Reference<${JSON.stringify(this.#name)}>`;
    }
}
