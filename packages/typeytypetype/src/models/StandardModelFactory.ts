import { ArrayDefinition } from '../definitions/ArrayDefinition';
import { Definition } from '../definitions/Definition';
import { ObjectDefinition } from '../definitions/ObjectDefinition';
import { UnionDefinition } from '../definitions/UnionDefinition';
import { descend } from '../internal/descend';
import { ArrayModelImpl } from './internal/ArrayModelImpl';
import { ModelImpl } from './internal/ModelImpl';
import { ObjectModelImpl } from './internal/ObjectModelImpl';
import { RecordModelImpl } from './internal/RecordModelImpl';
import { Model } from './Model';
import { ModelFactoryArgs } from './ModelFactory';

export class StandardModelFactory {
    create<T>(args: ModelFactoryArgs<T>): Model<T> {
        let definition: Definition<T>;

        if (args.definition instanceof UnionDefinition) {
            const match = args.definition.getDefinition(args.value);
            if (match === undefined) {
                throw new Error(
                    `Could not find matching definition for value.`
                );
            }
            definition = match;
        } else {
            definition = args.definition;
        }

        if (args.definition instanceof ArrayDefinition) {
            return new ArrayModelImpl(
                args.value as any,
                definition as any,
                args.definition,
                descend(args.depth),
                this
            ) as any;
        } else if (args.definition instanceof ObjectDefinition) {
            return new ObjectModelImpl(
                args.value,
                definition as any,
                args.definition,
                descend(args.depth),
                this
            ) as any;
        } else if (args.definition instanceof ObjectDefinition) {
            return new RecordModelImpl<any>(
                args.value as any,
                definition as any,
                args.definition,
                descend(args.depth),
                this
            ) as any;
        } else {
            return new ModelImpl(
                args.value,
                definition,
                args.definition,
                descend(args.depth),
                this
            ) as any;
        }
    }

    static readonly defaultMaxDepth = 25;
}
