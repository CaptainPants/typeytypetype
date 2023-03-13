import { type Type } from './Type.js';
import { ArrayType } from './ArrayType.js';
import { NumberType } from './NumberType.js';
import { StringType } from './StringType.js';
import {
    BooleanConstantType,
    NullConstantType,
    NumberConstantType,
    StringConstantType,
    UndefinedConstantType,
} from './ConstantTypes.js';
import { BooleanType } from './BooleanType.js';
import { UnionType } from './UnionType.js';
import { DeferredType } from './DeferredType.js';
import { RigidObjectType } from './RigidObjectType.js';
import { MapObjectType } from './MapObjectType.js';
import { type PropertyDefinitions, type MappedType } from './internal/types.js';
import { PropertyDefinition } from './PropertyDefinition.js';

function constant(value: string): StringConstantType;
function constant(value: number): NumberConstantType;
function constant(value: boolean): BooleanConstantType;
function constant(value: unknown): unknown {
    if (typeof value === 'string') {
        return new StringConstantType(value) satisfies Type<string> as any;
    } else if (typeof value === 'number') {
        return new NumberConstantType(value) satisfies Type<number> as any;
    } else if (typeof value === 'boolean') {
        return new BooleanConstantType(value) satisfies Type<boolean> as any;
    } else {
        throw new TypeError('Not supported');
    }
}

export const Types = {
    constant,

    null() {
        return new NullConstantType();
    },

    undefined(): Type<undefined> {
        return new UndefinedConstantType();
    },

    string(): StringType {
        return new StringType();
    },

    boolean(): BooleanType {
        return new BooleanType();
    },

    number(): NumberType {
        return new NumberType();
    },

    union<TTypeArray extends readonly unknown[]>(
        ...types: MappedType<TTypeArray>
    ) {
        // making the type system unhappy here
        return new UnionType<TTypeArray[number]>(types as any);
    },

    object<TObject extends Readonly<Record<string, unknown>>>(
        propertyDefinitions: PropertyDefinitions<TObject>
    ) {
        return new RigidObjectType<TObject>(propertyDefinitions);
    },

    map<TValue>(valueDefinition: Type<TValue>) {
        return new MapObjectType<TValue>(valueDefinition);
    },

    array<TElement>(elementDefinition: Type<TElement>): ArrayType<TElement> {
        return new ArrayType(elementDefinition);
    },

    deferred<TType>(name: string): DeferredType<TType> {
        return new DeferredType<TType>(name);
    },

    prop<TType>(type: Type<TType>) {
        return new PropertyDefinition<TType>(type);
    },
};
