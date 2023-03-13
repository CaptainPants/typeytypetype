import { BaseType } from './BaseType.js';

export class BooleanType extends BaseType<boolean> {
    override doMatches(
        value: unknown,
        _deep: boolean,
        _depth: number
    ): value is boolean {
        return typeof value === 'boolean';
    }

    override doToTypeString(depth: number): string {
        return 'boolean';
    }
}
