import { ArrayDefinition } from '../definitions/ArrayDefinition';
import { BooleanTypeDefinition } from '../definitions/BooleanTypeDefinition';
import { DateTypeDefinition } from '../definitions/DateTypeDefinition';
import { Definition } from '../definitions/Definition';
import { NumberTypeDefinition } from '../definitions/NumberTypeDefinition';
import { ObjectDefinition } from '../definitions/ObjectDefinition';
import { RecordDefinition } from '../definitions/RecordDefinition';
import { StringTypeDefinition } from '../definitions/StringTypeDefinition';
import { UnionDefinition } from '../definitions/UnionDefinition';
import { ArrayModel } from './ArrayModel';
import { Model } from './Model';
import { ModelFactory } from './ModelFactory';
import { ObjectModel } from './ObjectModel';
import { RecordModel } from './RecordModel';
import {
    BooleanModel,
    DateModel,
    NumberModel,
    StringModel,
} from './SimpleModel';
import { ModelCreationArgs, ModelFactoryArgs } from './types';
import { UnionModel } from './UnionModel';

type LooseDefinitionConstructor<T> = new (...args: any[]) => Definition<T>;

type FactoryMethod = (args: ModelCreationArgs<any, any>) => Model<any, any>;

const map = new Map<
    LooseDefinitionConstructor<any>,
    FactoryMethod
>();

map.set(NumberTypeDefinition, args => new NumberModel(args));
map.set(StringTypeDefinition, args => new StringModel(args));
map.set(BooleanTypeDefinition, args => new BooleanModel(args));
map.set(DateTypeDefinition, args => new DateModel(args));

map.set(ArrayDefinition, args => new ArrayModel(args));
map.set(ObjectDefinition, args => new ObjectModel(args));
map.set(RecordDefinition, args => new RecordModel<any>(args));

map.set(UnionDefinition, args => new UnionModel<any>(args));
// map.set(NamedDefinition, NamedModel);

export class StandardModelFactory implements ModelFactory {
    static readonly defaultMaxDepth = 25;

    create<T, TDef extends Definition<T> = Definition<T>>(
        { value, definition, replace, depth }: ModelFactoryArgs<T, TDef>
    ): Model<T, TDef> {
        const match = map.get(
            definition.constructor as LooseDefinitionConstructor<any>
        );

        if (match === undefined) {
            throw new Error('No match');
        }

        return match({ value, definition, replace, depth, factory: this });
    }
}
