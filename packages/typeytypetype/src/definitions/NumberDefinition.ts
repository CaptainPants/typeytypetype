import { BaseDefinition } from './BaseDefinition.js';

export class NumberDefinition extends BaseDefinition<number> {
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
