import { ArrayDefinition } from '../definitions/ArrayDefinition';
import { BooleanTypeDefinition } from '../definitions/BooleanTypeDefinition';
import { DateTypeDefinition } from '../definitions/DateTypeDefinition';
import { Definition } from '../definitions/Definition';
import { NamedDefinition } from '../definitions/NamedDefinition';
import { NumberTypeDefinition } from '../definitions/NumberTypeDefinition';
import { ObjectDefinition } from '../definitions/ObjectDefinition';
import { RecordDefinition } from '../definitions/RecordDefinition';
import { StringTypeDefinition } from '../definitions/StringTypeDefinition';
import { UnionDefinition } from '../definitions/UnionDefinition';
import { Replacer } from '../types';
import { ArrayModel } from './ArrayModel';
import { Model } from './Model';
import { ModelFactory } from './ModelFactory';
import { NamedModel } from './NamedModel';
import { ObjectModel } from './ObjectModel';
import { RecordModel } from './RecordModel';
import {
    BooleanModel,
    DateModel,
    NumberModel,
    StringModel,
} from './SimpleModel';
import { UnionModel } from './UnionModel';

type LooseDefinitionConstructor<T> = new (...args: any[]) => Definition<T>;
type ModelConstructor<T, TDef extends Definition<T>> = new (
    value: T,
    definition: TDef,
    replace: Replacer<T>,
    depth: number,
    factory: ModelFactory
) => Model<T>;

const map = new Map<
    LooseDefinitionConstructor<any>,
    ModelConstructor<any, any>
>();

map.set(NumberTypeDefinition, NumberModel);
map.set(StringTypeDefinition, StringModel);
map.set(BooleanTypeDefinition, BooleanModel);
map.set(DateTypeDefinition, DateModel);

map.set(ArrayDefinition, ArrayModel);
map.set(ObjectDefinition, ObjectModel);
map.set(RecordDefinition, RecordModel);

map.set(UnionDefinition, UnionModel);
map.set(NamedDefinition, NamedModel);

export class StandardModelFactory implements ModelFactory {
    static readonly defaultMaxDepth = 25;

    create<T>(
        value: T,
        definition: Definition<T>,
        replaced: Replacer<T>,
        depth: number
    ): Model<T> {
        const Match = map.get(
            definition.constructor as LooseDefinitionConstructor<any>
        );

        if (Match === undefined) {
            throw new Error('No match');
        }

        return new Match(value, definition, replaced, depth, this);
    }
}
