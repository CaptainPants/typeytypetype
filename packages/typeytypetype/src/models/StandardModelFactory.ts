import { ArrayDefinition } from '../definitions/ArrayDefinition';
import { Definition } from '../definitions/Definition';
import { ObjectDefinition } from '../definitions/ObjectDefinition';
import { UnionDefinition } from '../definitions/UnionDefinition';
import { descend } from '../internal/descend';
import { ArrayModelImpl } from './internal/ArrayModelImpl';
import { ModelImpl } from './internal/ModelImpl';
import { ObjectModelImpl } from './internal/ObjectModelImpl';
import { Model } from './Model';
import { ModelFactoryArgs } from './ModelFactory';

export class StandardModelFactory {
    create<T>({ value, definition, depth }: ModelFactoryArgs<T>): Model<T> {
        let selectedDefinition: Definition<T>;

        if (definition instanceof UnionDefinition) {
            const match = definition.getDefinition(value);
            if (match === undefined) {
                throw new Error(
                    `Could not find matching definition for value.`
                );
            }
            selectedDefinition = match;
        } else {
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
