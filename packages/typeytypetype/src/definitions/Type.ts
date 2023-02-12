import { type Definition } from './Definition.js';
import { ArrayDefinition } from './ArrayDefinition.js';
import { NumberTypeDefinition } from './NumberTypeDefinition.js';
import { StringTypeDefinition } from './StringTypeDefinition.js';
import { ConstantDefinition } from './ConstantDefinition.js';
import { BooleanTypeDefinition } from './BooleanTypeDefinition.js';
import { UnionDefinition } from './UnionDefinition.js';
import { DeferredDefinition } from './DeferredDefinition.js';
import { RigidObjectDefinition } from './RigidObjectDefinition.js';
import { MapObjectDefinition } from './MapObjectDefinition.js';
import { type MappedDefinition } from './internal/types.js';

export const Type = {
    constant<TValue extends string | number | boolean>(
        value: TValue
    ): ConstantDefinition<TValue> {
        return new ConstantDefinition(value);
    },

    null() {
        return new ConstantDefinition(null);
    },

    undefined(): Definition<undefined> {
        return new ConstantDefinition(undefined);
    },

    string(): StringTypeDefinition {
        return new StringTypeDefinition();
    },

    boolean(): BooleanTypeDefinition {
        return new BooleanTypeDefinition();
    },

    number(): NumberTypeDefinition {
        return new NumberTypeDefinition();
    },

    union<TTypes extends readonly unknown[]>(
        ...definitions: MappedDefinition<TTypes>
    ) {
        // making the type system unhappy here
        return new UnionDefinition<TTypes[number]>(definitions as any);
    },

    object<TObject extends Record<string, unknown>>(
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
