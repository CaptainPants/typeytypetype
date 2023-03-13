import { BaseType } from './BaseType.js';

export class NumberType extends BaseType<number> {
    override doMatches(
        value: unknown,
        _deep: boolean,
        _depth: number
    ): value is number {
        return typeof value === 'number';
    }

    override doToTypeString(depth: number): string {
        return 'number';
    }
}
