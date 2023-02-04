import { Definition } from '../definitions/Definition';
import { RecordDefinition } from '../definitions/RecordDefinition';
import { Replacer } from '../types';
import { Model } from './Model';
import { ModelBase } from './ModelBase';

export class RecordModel<TValue> extends ModelBase<Record<string, TValue>, RecordDefinition<TValue>> {
    override expandoPropertyDefinition(): Definition<unknown> | undefined {
        throw new Error();
    }

    override getExpandoProperty(key: string): Model<unknown> | undefined {
        throw new Error();
    }

    override async setExpandoProperty(
        key: string,
        value: unknown
    ): Promise<void> {
        throw new Error();
    }

    override async deleteExpandoProperty(key: string): Promise<void> {
        throw new Error();
    }

    override clone(replace: Replacer<Record<string, TValue>>): Model<Record<string, TValue>, RecordDefinition<TValue>> {
        return new RecordModel<TValue>({
            value: this.value, 
            definition: this.definition, 
            replace, 
            depth: this.depth, 
            factory: this.factory
        });
    }
}
