import { Definition } from './Definition.js';

export class NumberTypeDefinition extends Definition<number> {
    override doMatches(value: unknown, depth: number): boolean {
        return typeof value === 'number';
    }

    override doToTypeString(depth: number): string {
        return 'number';
    }
}
