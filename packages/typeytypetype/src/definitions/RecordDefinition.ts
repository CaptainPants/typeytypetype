import { descend } from '../internal/descend';
import { ResolutionContext } from '../ResolutionContext';
import { Definition } from './Definition';

export class RecordDefinition<TValue> extends Definition<
    Record<string, TValue>
> {
    constructor(valueDefinition: Definition<TValue>) {
        super();
        this.#valueDefinition = valueDefinition;
    }

    #valueDefinition: Definition<TValue>;

    getExpandoDefinition(): Definition<TValue> {
        return this.#valueDefinition;
    }

    override doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        if (typeof value !== 'object' || value === null) {
            return false;
        }

        // Are there any failed validations
        return (
            Object.keys(value).findIndex(
                (key) =>
                    !this.#valueDefinition.doValidate(
                        resolutionContext,
                        (value as Record<string, unknown>)[key],
                        descend(depth)
                    )
            ) < 0
        );
    }

    override doToTypeString(depth: number): string {
        return `Record<string, ${JSON.stringify(
            this.#valueDefinition.doToTypeString(descend(depth))
        )}>`;
    }
}