import { Definition } from './Definition.js';
import { ResolutionContext } from './ResolutionContext.js';

export class StringTypeDefinition extends Definition<string> {
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
