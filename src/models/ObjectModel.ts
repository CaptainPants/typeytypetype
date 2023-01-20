import { MappedModel } from '../internal/utilityTypes';
import { Model } from './Model';

export class ObjectModel<
    TPropertyTypes extends Record<string, unknown>
> extends Model<TPropertyTypes> {
    constructor(modelProperies: MappedModel<TPropertyTypes>) {
        super();
        this.#modelProperies = modelProperies;
    }

    #modelProperies: MappedModel<TPropertyTypes>;

    toTypeString(): string {
        return (
            '{\r\n' +
            Object.entries(this.#modelProperies)
                .map(
                    ([key, model]: [string, Model<unknown>]) =>
                        `${JSON.stringify(key)}: ${model.toTypeString()}`
                )
                .join('\r\n') +
            '\r\n}'
        );
    }
}
