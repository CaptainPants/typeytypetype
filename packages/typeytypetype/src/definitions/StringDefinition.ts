import { BaseDefinition } from './BaseDefinition.js';

export class StringDefinition extends BaseDefinition<string> {
    override doMatches(value: unknown, depth: number): value is string {
        return typeof value === 'string';
    }

    override doToTypeString(depth: number): string {
        return 'string';
    }
}
