import { type Definition } from './Definition.js';
import { ArrayDefinition } from './ArrayDefinition.js';
import { NumberDefinition } from './NumberDefinition.js';
import { StringDefinition } from './StringDefinition.js';
import {
    BooleanConstantDefinition,
    NullConstantDefinition,
    NumberConstantDefinition,
    StringConstantDefinition,
    UndefinedConstantDefinition,
} from './ConstantDefinition.js';
import { BooleanDefinition } from './BooleanDefinition.js';
import { UnionDefinition } from './UnionDefinition.js';
import { DeferredDefinition } from './DeferredDefinition.js';
import { RigidObjectDefinition } from './RigidObjectDefinition.js';
import { MapObjectDefinition } from './MapObjectDefinition.js';
import { type MappedDefinition } from './internal/types.js';

function constant(value: string): StringConstantDefinition;
function constant(value: number): NumberConstantDefinition;
function constant(value: boolean): BooleanConstantDefinition;
function constant(value: unknown): unknown {
    if (typeof value === 'string') {
        return new StringConstantDefinition(
            value
        ) satisfies Definition<string> as any;
    } else if (typeof value === 'number') {
        return new NumberConstantDefinition(
            value
        ) satisfies Definition<number> as any;
    } else if (typeof value === 'boolean') {
        return new BooleanConstantDefinition(
            value
        ) satisfies Definition<boolean> as any;
    } else {
        throw new TypeError('Not supported');
    }
}

export const Type = {
    constant,

    null() {
        return new NullConstantDefinition();
    },

    undefined(): Definition<undefined> {
        return new UndefinedConstantDefinition();
    },

    string(): StringDefinition {
        return new StringDefinition();
    },

    boolean(): BooleanDefinition {
        return new BooleanDefinition();
    },

    number(): NumberDefinition {
        return new NumberDefinition();
    },

    union<TTypes extends readonly unknown[]>(
        ...definitions: MappedDefinition<TTypes>
    ) {
        // making the type system unhappy here
        return new UnionDefinition<TTypes[number]>(definitions as any);
    },

    object<TObject extends Readonly<Record<string, unknown>>>(
        propertyDefinitions: MappedDefinition<TObject>
    ) {
        return new RigidObjectDefinition<TObject>(propertyDefinitions);
    },

    map<TValue>(valueDefinition: Definition<TValue>) {
        return new MapObjectDefinition<TValue>(valueDefinition);
    },

    array<TElement>(
        elementDefinition: Definition<TElement>
    ): ArrayDefinition<TElement> {
        return new ArrayDefinition(elementDefinition);
    },

    named<TType>(name: string): DeferredDefinition<TType> {
        return new DeferredDefinition<TType>(name);
    },
};
