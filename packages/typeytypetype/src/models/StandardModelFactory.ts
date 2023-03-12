import { ArrayDefinition } from '../definitions/ArrayDefinition.js';
import { type ObjectDefinition } from '../definitions/ObjectDefinition.js';
import { UnionDefinition } from '../definitions/UnionDefinition.js';
import { descend } from '../internal/descend.js';
import { ArrayModelImpl } from './internal/ArrayModelImpl.js';
import { ObjectModelImpl } from './internal/ObjectModelImpl.js';
import { type Model } from './Model.js';
import {
    type ModelFactory,
    type CreateUnvalidatedModelPartArgs,
    type CreateModelArgs,
} from './ModelFactory.js';
import { UnionModelImpl } from './internal/UnionModelImpl.js';
import {
    BooleanConstantDefinition,
    BooleanDefinition,
    type Definition,
    MapObjectDefinition,
    NullConstantDefinition,
    NumberConstantDefinition,
    NumberDefinition,
    RigidObjectDefinition,
    StringConstantDefinition,
    StringDefinition,
    UndefinedConstantDefinition,
} from '../definitions/index.js';
import { SimpleModelImpl } from './internal/SimpleModelImpl.js';

// eslint-disable-next-line @typescript-eslint/ban-types -- Used as a key to identify the actual type of a Definition object
type ConstructorFunction = Function;
type ModelFactoryMethod = (
    value: unknown,
    definition: Definition<any>,
    depth: number,
    factory: ModelFactory
) => Model<any>;

const defaults: Array<
    // eslint-disable-next-line @typescript-eslint/ban-types -- Used as a key to identify the actual type of a Definition object
    [constructor: ConstructorFunction, factoryMethod: ModelFactoryMethod]
> = [
    [
        UnionDefinition,
        (value, definition, depth, factory) =>
            new UnionModelImpl<any>(
                value,
                definition as UnionDefinition<any>,
                depth,
                factory
            ),
    ],
    [
        ArrayDefinition,
        (value, definition, depth, factory) =>
            new ArrayModelImpl<any>(
                value as unknown[],
                definition as ArrayDefinition<any>,
                depth,
                factory
            ),
    ],
    [
        RigidObjectDefinition,
        (value, definition, depth, factory) =>
            new ObjectModelImpl<any>(
                value,
                definition as ObjectDefinition<any>,
                depth,
                factory
            ),
    ],
    [
        MapObjectDefinition,
        (value, definition, depth, factory) =>
            new ObjectModelImpl<any>(
                value,
                definition as ObjectDefinition<any>,
                depth,
                factory
            ),
    ],
    [
        StringConstantDefinition,
        (value, definition, depth, factory) =>
            new SimpleModelImpl<
                string,
                StringConstantDefinition,
                'string-constant'
            >(
                'string-constant',
                value as string,
                definition as StringConstantDefinition,
                depth,
                factory
            ),
    ],
    [
        StringDefinition,
        (value, definition, depth, factory) =>
            new SimpleModelImpl<string, StringDefinition, 'string'>(
                'string',
                value as string,
                definition as StringDefinition,
                depth,
                factory
            ),
    ],
    [
        NumberConstantDefinition,
        (value, definition, depth, factory) =>
            new SimpleModelImpl<
                number,
                NumberConstantDefinition,
                'number-constant'
            >(
                'number-constant',
                value as number,
                definition as NumberConstantDefinition,
                depth,
                factory
            ),
    ],
    [
        NumberDefinition,
        (value, definition, depth, factory) =>
            new SimpleModelImpl<number, NumberDefinition, 'number'>(
                'number',
                value as number,
                definition as NumberDefinition,
                depth,
                factory
            ),
    ],
    [
        BooleanConstantDefinition,
        (value, definition, depth, factory) =>
            new SimpleModelImpl<
                boolean,
                BooleanConstantDefinition,
                'boolean-constant'
            >(
                'boolean-constant',
                value as boolean,
                definition as BooleanConstantDefinition,
                depth,
                factory
            ),
    ],
    [
        BooleanDefinition,
        (value, definition, depth, factory) =>
            new SimpleModelImpl<boolean, BooleanDefinition, 'boolean'>(
                'boolean',
                value as boolean,
                definition as BooleanDefinition,
                depth,
                factory
            ),
    ],
    [
        NullConstantDefinition,
        (value, definition, depth, factory) =>
            new SimpleModelImpl<null, NullConstantDefinition, 'null'>(
                'null',
                value as null,
                definition as NullConstantDefinition,
                depth,
                factory
            ),
    ],
    [
        UndefinedConstantDefinition,
        (value, definition, depth, factory) =>
            new SimpleModelImpl<
                undefined,
                UndefinedConstantDefinition,
                'undefined'
            >(
                'undefined',
                value as undefined,
                definition as UndefinedConstantDefinition,
                depth,
                factory
            ),
    ],
];
export class StandardModelFactory implements ModelFactory {
    constructor() {
        for (const [key, value] of defaults) {
            this.#map.set(key, value);
        }
    }

    #map: WeakMap<ConstructorFunction, ModelFactoryMethod> = new WeakMap<
        ConstructorFunction,
        ModelFactoryMethod
    >();

    createModel<T>(args: CreateModelArgs<T>): Promise<Model<T>>;
    async createModel<T>({
        value,
        definition,
    }: CreateModelArgs<T>): Promise<Model<T>> {
        const typed = await definition.validateAndThrow(value);

        return this.createUnvalidatedModelPart<T>({
            value: typed,
            definition,
            depth: StandardModelFactory.defaultMaxDepth,
        });
    }

    createUnvalidatedModelPart<T>(
        args: CreateUnvalidatedModelPartArgs<T>
    ): Model<T> {
        // This indirection is mostly so that we don't have 15 'as any' parts,
        // and just have the one 'any' return type
        return this.#doCreateModelPart(args);
    }

    #doCreateModelPart<T>({
        value,
        definition,
        depth,
    }: CreateUnvalidatedModelPartArgs<T>): any {
        const match = this.#map.get(definition.constructor);
        if (match === undefined) {
            throw new TypeError(
                `Unrecognised definition type ${definition.constructor.name}.`
            );
        }

        return match(value, definition, descend(depth), this);
    }

    static readonly defaultMaxDepth = 25;
}
