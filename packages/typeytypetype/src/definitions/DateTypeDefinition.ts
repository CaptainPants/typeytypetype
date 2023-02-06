import { type ResolutionContext } from './ResolutionContext.js';
import { Definition } from './Definition.js';

export class DateTypeDefinition extends Definition<string> {
    override doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return typeof value === 'string';
    }

    override doToTypeString(depth: number): string {
        return 'string';
    }
}
