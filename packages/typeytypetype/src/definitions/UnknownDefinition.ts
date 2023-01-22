import { ResolutionContext } from '../ResolutionContext.js';
import { Definition } from './Definition.js';

export class UnknownDefinition extends Definition<unknown> {
    doValidate(
        resolutionContext: ResolutionContext,
        value: unknown,
        depth: number
    ): boolean {
        return true;
    }

    doToTypeString(depth: number): string {
        return 'unknown';
    }
}
