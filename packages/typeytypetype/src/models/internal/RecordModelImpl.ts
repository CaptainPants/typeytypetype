import { Definition } from '../../definitions/Definition';
import { RecordDefinition } from '../../definitions/RecordDefinition';
import { descend } from '../../internal/descend';
import { Model, RecordModelParts } from '../Model';
import { ModelImpl } from './ModelImpl';

export class RecordModelImpl<TValue>
    extends ModelImpl<Record<string, TValue>, RecordDefinition<TValue>>
    implements RecordModelParts<TValue>
{
    expandoPropertyDefinition(): Definition<TValue> | undefined {
        return this.definition.getExpandoDefinition();
    }

    getExpandoProperty(key: string): Model<TValue> | undefined {
        const definition = this.definition.getExpandoDefinition();
        if (definition === undefined) {
            throw new Error('Expando properties not allowed.');
        }

        if (!Object.prototype.hasOwnProperty.call(this.value, key)) {
            return undefined;
        }

        return this.factory.create<TValue>({
            value: this.value[key] as TValue,
            definition,
            depth: descend(this.depth),
        });
    }

    async setExpandoProperty(
        key: string,
        value: TValue
    ): Promise<Model<Record<string, TValue>>> {
        const copy = {
            ...this.value,
            [key]: value,
        };
        return new RecordModelImpl<TValue>(
            copy as any,
            this.definition,
            this.originalDefinition,
            this.depth,
            this.factory
        );
    }

    async deleteExpandoProperty(
        key: string
    ): Promise<Model<Record<string, TValue>>> {
        const copy = {
            ...this.value,
        };
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete copy[key];
        return new RecordModelImpl<TValue>(
            copy,
            this.definition,
            this.originalDefinition,
            this.depth,
            this.factory
        );
    }
}
