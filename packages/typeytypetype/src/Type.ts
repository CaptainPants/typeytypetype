import { Definition } from './definitions/Definition.js';
import { ArrayDefinition } from './definitions/ArrayDefinition.js';
import { NumberTypeDefinition } from './definitions/NumberTypeDefinition.js';
import { StringTypeDefinition } from './definitions/StringTypeDefinition.js';
import { ConstantDefinition } from './definitions/ConstantDefinition.js';
import { BooleanTypeDefinition } from './definitions/BooleanTypeDefinition.js';
import { UnionDefinition } from './definitions/UnionDefinition.js';
import { ObjectDefinition } from './definitions/ObjectDefinition.js';
import { MappedDefinition } from './internal/utilityTypes.js';
import { NamedDefinition } from './definitions/NamedDefinition.js';

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
        return new UnionDefinition<TTypes>(definitions);
    },

    object<TPropertyTypes extends Record<string, unknown>>(
        propertyDefinitions: MappedDefinition<TPropertyTypes>
    ) {
        return new ObjectDefinition(propertyDefinitions);
    },

    array<T>(
        itemDefinition: Definition<T>
    ): ArrayDefinition<T[]> {
        return new ArrayDefinition(itemDefinition);
    },

    named<TType>(name: string): NamedDefinition<TType> {
        return new NamedDefinition<TType>(name);
    },
};
