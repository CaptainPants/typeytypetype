import { createResolutionContext } from '../definitions/createResolutionContext.js';
import { ArrayDefinition } from '../definitions/ArrayDefinition.js';
import { ObjectDefinition } from '../definitions/ObjectDefinition.js';
import { UnionDefinition } from '../definitions/UnionDefinition.js';
import { descend } from '../internal/descend.js';
import { ArrayModelImpl } from './internal/ArrayModelImpl.js';
import { ObjectModelImpl } from './internal/ObjectModelImpl.js';
import { type Model } from './Model.js';
import {
    type ModelFactory,
    type CreateModelPartArgs,
    type CreateModelArgs,
} from './ModelFactory.js';
import { type ResolutionContext } from '../definitions/ResolutionContext.js';
import { UnionModelImpl } from './internal/UnionModelImpl.js';
import {
    BooleanConstantDefinition,
    BooleanDefinition,
    NumberConstantDefinition,
    NumberDefinition,
    StringConstantDefinition,
    StringDefinition,
} from '../definitions/index.js';
import { SimpleModelImpl } from './internal/SimpleModelImpl.js';

export class StandardModelFactory implements ModelFactory {
    constructor() {
        this.#resolutionContext = createResolutionContext();
    }

    #resolutionContext: ResolutionContext;

    createModel<T>(args: CreateModelArgs<T>): Promise<Model<T>>;
    async createModel<T>({
        parent,
        value,
        definition,
    }: CreateModelArgs<T>): Promise<Model<T>> {
        const typed = await definition.validateCast(value, { deep: true });

        return this.createModelPart<T>({
            parent,
            value: typed,
            definition,
            depth: StandardModelFactory.defaultMaxDepth,
        });
    }

    createModelPart<T>(args: CreateModelPartArgs<T>): Model<T> {
        // This indirection is mostly so that we don't have 15 'as any' parts,
        // and just have the one 'any' return type
        return this.#doCreateModelPart(args);
    }

    #doCreateModelPart<T>({
        parent = null,
        value,
        definition,
        depth,
    }: CreateModelPartArgs<T>): any {
        if (definition instanceof UnionDefinition) {
            return new UnionModelImpl<any>(
                parent,
                value,
                definition,
                descend(depth),
                this
            );
        } else if (definition instanceof ArrayDefinition) {
            return new ArrayModelImpl(
                parent,
                value as T[],
                definition,
                descend(depth),
                this
            );
            // This might be Rigid or Map
        } else if (definition instanceof ObjectDefinition) {
            return new ObjectModelImpl(
                parent,
                value,
                definition,
                descend(depth),
                this
            );
        } else if (definition instanceof StringDefinition) {
            return new SimpleModelImpl(
                'string',
                parent,
                value as string,
                definition,
                descend(depth),
                this
            );
        } else if (definition instanceof StringConstantDefinition) {
            return new SimpleModelImpl(
                'string-constant',
                parent,
                value as string,
                definition,
                descend(depth),
                this
            );
        } else if (definition instanceof NumberDefinition) {
            return new SimpleModelImpl(
                'number',
                parent,
                value as number,
                definition,
                descend(depth),
                this
            );
        } else if (definition instanceof NumberConstantDefinition) {
            return new SimpleModelImpl(
                'number-constant',
                parent,
                value as number,
                definition,
                descend(depth),
                this
            );
        } else if (definition instanceof BooleanDefinition) {
            return new SimpleModelImpl(
                'boolean',
                parent,
                value as boolean,
                definition,
                descend(depth),
                this
            );
        } else if (definition instanceof BooleanConstantDefinition) {
            return new SimpleModelImpl(
                'boolean-constant',
                parent,
                value as boolean,
                definition,
                descend(depth),
                this
            );
        } else {
            throw new TypeError(
                `Unrecognised definition type ${definition.constructor.name}.`
            );
        }
    }

    static readonly defaultMaxDepth = 25;
}
