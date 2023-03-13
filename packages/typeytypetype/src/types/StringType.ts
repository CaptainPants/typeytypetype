import { BaseType } from './BaseType.js';

export class StringType extends BaseType<string> {
    override doMatches(
        value: unknown,
        _deep: boolean,
        _depth: number
    ): value is string {
        return typeof value === 'string';
    }

    override doToTypeString(depth: number): string {
        return 'string';
    }
}
