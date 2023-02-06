import { createResolutionContext } from '../definitions/createResolutionContext.js';
import { ArrayDefinition } from '../definitions/ArrayDefinition.js';
import { type Definition } from '../definitions/Definition.js';
import { ObjectDefinition } from '../definitions/ObjectDefinition.js';
import { UnionDefinition } from '../definitions/UnionDefinition.js';
import { descend } from '../internal/descend.js';
import { ArrayModelImpl } from './internal/ArrayModelImpl.js';
import { ModelImpl } from './internal/ModelImpl.js';
import { ObjectModelImpl } from './internal/ObjectModelImpl.js';
import { type Model } from './Model.js';
import { type ModelFactoryArgs } from './ModelFactory.js';
import { type ResolutionContext } from '../definitions/ResolutionContext.js';

export class StandardModelFactory {
    constructor() {
        this.#resolutionContext = createResolutionContext();
    }

    #resolutionContext: ResolutionContext;

    create<T>({ value, definition, depth }: ModelFactoryArgs<T>): Model<T> {
        let selectedDefinition: Definition<T>;

        if (definition instanceof UnionDefinition) {
            const match = definition.getDefinition(
                this.#resolutionContext,
                value
            );
            if (match === undefined) {
                throw new Error(
                    `Could not find matching definition for value.`
                );
            }
            selectedDefinition = match;
        } else {
            if (!definition.validate(this.#resolutionContext, value)) {
                throw new TypeError(`Invalid value.`);
            }

            selectedDefinition = definition;
        }

        if (selectedDefinition instanceof ArrayDefinition) {
            return new ArrayModelImpl(
                value as any,
                selectedDefinition,
                definition as any,
                descend(depth),
                this
            ) as any;
            // This might be Rigid or Map
        } else if (selectedDefinition instanceof ObjectDefinition) {
            return new ObjectModelImpl(
                value as any,
                selectedDefinition,
                definition,
                descend(depth),
                this
            ) as any;
        } else {
            return new ModelImpl(
                value,
                selectedDefinition,
                definition,
                descend(depth),
                this
            ) as any;
        }
    }

    static readonly defaultMaxDepth = 25;
}
