import { BaseDefinition } from './BaseDefinition.js';

export class BooleanTypeDefinition extends BaseDefinition<boolean> {
    override doMatches(value: unknown, _depth: number): value is boolean {
        return typeof value === 'boolean';
    }

    override doToTypeString(depth: number): string {
        return 'boolean';
    }
}
