import { ResolutionContext } from './ResolutionContext.js';
import { Definition } from './Definition.js';

export class NumberTypeDefinition extends Definition<number> {
    override doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return typeof value === 'number';
    }

    override doToTypeString(depth: number): string {
        return 'number';
    }
}
