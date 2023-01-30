import { Definition } from '../definitions/Definition';
import { Model } from './Model';

export class RecordModel extends Model<Record<string, unknown>> {
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
}
