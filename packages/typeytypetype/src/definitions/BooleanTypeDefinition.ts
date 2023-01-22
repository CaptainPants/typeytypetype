import { ResolutionContext } from '../ResolutionContext.js';
import { Definition } from './Definition.js';

export class BooleanTypeDefinition extends Definition<boolean> {
    override doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        _depth: number
    ): boolean {
        return typeof value === 'boolean';
    }

    override doToTypeString(depth: number): string {
        return 'boolean';
    }
}
