import { ArrayType } from '../types/ArrayType.js';
import { type ObjectType } from '../types/ObjectType.js';
import { UnionType } from '../types/UnionType.js';
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
    BooleanConstantType,
    BooleanType,
    type Type,
    MapObjectType,
    NullConstantType,
    NumberConstantType,
    NumberType,
    RigidObjectType,
    StringConstantType,
    StringType,
    UndefinedConstantType,
} from '../types/index.js';
import { SimpleModelImpl } from './internal/SimpleModelImpl.js';

// eslint-disable-next-line @typescript-eslint/ban-types -- Used as a key to identify the actual type of a Definition object
type ConstructorFunction = Function;
type ModelFactoryMethod = (
    value: unknown,
    type: Type<any>,
    depth: number,
    factory: ModelFactory
) => Model<any>;

const defaults: Array<
    // eslint-disable-next-line @typescript-eslint/ban-types -- Used as a key to identify the actual type of a Definition object
    [constructor: ConstructorFunction, factoryMethod: ModelFactoryMethod]
> = [
    [
        UnionType,
        (value, type, depth, factory) =>
            new UnionModelImpl<any>(
                value,
                type as UnionType<any>,
                depth,
                factory
            ),
    ],
    [
        ArrayType,
        (value, type, depth, factory) =>
            new ArrayModelImpl<any>(
                value as unknown[],
                type as ArrayType<any>,
                depth,
                factory
            ),
    ],
    [
        RigidObjectType,
        (value, type, depth, factory) =>
            new ObjectModelImpl<any>(
                value,
                type as ObjectType<any>,
                depth,
                factory
            ),
    ],
    [
        MapObjectType,
        (value, type, depth, factory) =>
            new ObjectModelImpl<any>(
                value,
                type as ObjectType<any>,
                depth,
                factory
            ),
    ],
    [
        StringConstantType,
        (value, type, depth, factory) =>
            new SimpleModelImpl<string, StringConstantType, 'string-constant'>(
                'string-constant',
                value as string,
                type as StringConstantType,
                depth,
                factory
            ),
    ],
    [
        StringType,
        (value, type, depth, factory) =>
            new SimpleModelImpl<string, StringType, 'string'>(
                'string',
                value as string,
                type as StringType,
                depth,
                factory
            ),
    ],
    [
        NumberConstantType,
        (value, type, depth, factory) =>
            new SimpleModelImpl<number, NumberConstantType, 'number-constant'>(
                'number-constant',
                value as number,
                type as NumberConstantType,
                depth,
                factory
            ),
    ],
    [
        NumberType,
        (value, type, depth, factory) =>
            new SimpleModelImpl<number, NumberType, 'number'>(
                'number',
                value as number,
                type as NumberType,
                depth,
                factory
            ),
    ],
    [
        BooleanConstantType,
        (value, type, depth, factory) =>
            new SimpleModelImpl<
                boolean,
                BooleanConstantType,
                'boolean-constant'
            >(
                'boolean-constant',
                value as boolean,
                type as BooleanConstantType,
                depth,
                factory
            ),
    ],
    [
        BooleanType,
        (value, type, depth, factory) =>
            new SimpleModelImpl<boolean, BooleanType, 'boolean'>(
                'boolean',
                value as boolean,
                type as BooleanType,
                depth,
                factory
            ),
    ],
    [
        NullConstantType,
        (value, type, depth, factory) =>
            new SimpleModelImpl<null, NullConstantType, 'null'>(
                'null',
                value as null,
                type as NullConstantType,
                depth,
                factory
            ),
    ],
    [
        UndefinedConstantType,
        (value, type, depth, factory) =>
            new SimpleModelImpl<undefined, UndefinedConstantType, 'undefined'>(
                'undefined',
                value as undefined,
                type as UndefinedConstantType,
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
        type,
    }: CreateModelArgs<T>): Promise<Model<T>> {
        const typed = await type.validateAndThrow(value);

        return this.createUnvalidatedModelPart<T>({
            value: typed,
            type,
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
        type,
        depth,
    }: CreateUnvalidatedModelPartArgs<T>): any {
        const match = this.#map.get(type.constructor);
        if (match === undefined) {
            throw new TypeError(`Unrecognised type ${type.constructor.name}.`);
        }

        return match(value, type, descend(depth), this);
    }

    static readonly defaultMaxDepth = 25;
}
