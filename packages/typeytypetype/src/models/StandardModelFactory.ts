import { createResolutionContext } from '../definitions/createResolutionContext.js';
import { ArrayDefinition } from '../definitions/ArrayDefinition.js';
import { ObjectDefinition } from '../definitions/ObjectDefinition.js';
import { UnionDefinition } from '../definitions/UnionDefinition.js';
import { descend } from '../internal/descend.js';
import { ArrayModelImpl } from './internal/ArrayModelImpl.js';
import { ModelImpl } from './internal/ModelImpl.js';
import { ObjectModelImpl } from './internal/ObjectModelImpl.js';
import { type Model } from './Model.js';
import { type ModelFactory, type ModelFactoryArgs } from './ModelFactory.js';
import { type ResolutionContext } from '../definitions/ResolutionContext.js';
import { UnionModelImpl } from './internal/UnionModelImpl.js';
import { type SpreadDefinition } from '../definitions/index.js';

export class StandardModelFactory implements ModelFactory {
    constructor() {
        this.#resolutionContext = createResolutionContext();
    }

    #resolutionContext: ResolutionContext;

    create<T>({ value, definition, depth }: ModelFactoryArgs<T>): Model<T> {
        if (definition instanceof UnionDefinition) {
            return new UnionModelImpl<any>(
                value,
                definition,
                descend(depth),
                this
            ) as any;
        } else if (definition instanceof ArrayDefinition) {
            return new ArrayModelImpl(
                value as any[],
                definition,
                descend(depth),
                this
            ) as any;
            // This might be Rigid or Map
        } else if (definition instanceof ObjectDefinition) {
            return new ObjectModelImpl(
                value as any,
                definition,
                descend(depth),
                this
            ) as any;
        } else {
            return new ModelImpl(
                value,
                definition,
                descend(depth),
                this
            ) as any;
        }
    }

    choose<TUnion>(
        value: TUnion,
        definition: UnionDefinition<TUnion>
    ): SpreadDefinition<TUnion> | undefined {
        const match = definition.getDefinition(value);
        // cheating the type system
        return match;
    }

    static readonly defaultMaxDepth = 25;
}
