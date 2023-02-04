import { Definition } from '../definitions/Definition';
import { UnionDefinition } from '../definitions/UnionDefinition';
import { descend } from '../internal/descend';
import { Replacer } from '../types';
import { DelegatingModel } from './DelegatingModel';
import { Model } from './Model';
import { ModelFactory } from './ModelFactory';
import { ModelCreationArgs } from './types';

export class UnionModel<
    TTypes extends readonly unknown[]
> extends DelegatingModel<TTypes[number], Definition<TTypes[number]>> {
    constructor(
        args: ModelCreationArgs<TTypes[number], UnionDefinition<TTypes>>
    ) {
        const matchingDefinition = args.definition.getDefinition(args.value);
        if (matchingDefinition === undefined) {
            throw new TypeError('Unexpected');
        }

        const model = args.factory.create<TTypes[number], Definition<TTypes[number]>>({
            value: args.value,
            definition: matchingDefinition,
            replace: args.replace,
            depth: descend(args.depth)
        });

        super(model);

        this.#originalDefinition = args.definition;
        this.#depth = args.depth;
        this.#factory = args.factory;
        this.#replace = args.replace;
    }

    #originalDefinition: UnionDefinition<TTypes>;
    #depth: number;
    #factory: ModelFactory;
    #replace: Replacer<TTypes[number]>;

    get replace(): Replacer<TTypes[number]> { return this.#replace; }

    override clone(replace: Replacer<TTypes[number]>): Model<TTypes[number], Definition<TTypes[number]>> {
        return new UnionModel<TTypes>({
            value: this.value, 
            definition: this.#originalDefinition, 
            replace, 
            depth: this.#depth, 
            factory: this.#factory
        });
    }
}
