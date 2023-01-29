import { ArrayDefinition } from '../definitions/ArrayDefinition';
import { Definition } from '../definitions/Definition';
import { NamedDefinition } from '../definitions/NamedDefinition';
import { ObjectDefinition } from '../definitions/ObjectDefinition';
import { RecordTypedDefinition } from '../definitions/RecordTypeDefinition';
import { UnionDefinition } from '../definitions/UnionDefinition';
import { Replacer } from '../types';
import { ArrayModel } from './ArrayModel';
import { Model } from './Model';
import { ModelFactory } from './ModelFactory';
import { SimpleModel } from './SimpleModel';

export class StandardModelFactory implements ModelFactory {
    create<T>(
        value: T,
        definition: Definition<T>,
        replaced: Replacer<T>,
        depth: number
    ): Model<T> {
        if (definition instanceof UnionDefinition) {
            return new UnionModel<T>(value, definition, replaced, depth, this);
        } else if (definition instanceof NamedDefinition) {
            return new NamedModel<T>(value, definition, replaced, depth, this);
        } else if (definition instanceof ArrayDefinition) {
            return new ArrayModel<any>(value, definition, replaced, depth, this) as Model<any>;
        } else if (definition instanceof RecordTypedDefinition) {
            return new RecordModel<T>(value, definition, replaced, depth, this);
        } else if (definition instanceof ObjectDefinition) {
            return new ObjectModel<T>(value, definition, replaced, depth, this);
        } else {
            return new SimpleModel<any>(
                value,
                definition,
                replaced,
                depth,
                this
            );
        }
    }
}
