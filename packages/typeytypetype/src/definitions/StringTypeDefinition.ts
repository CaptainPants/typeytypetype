import { Definition } from './Definition.js';

export class StringTypeDefinition extends Definition<string> {
    override doMatches(value: unknown, depth: number): boolean {
        return typeof value === 'string';
    }

    override doToTypeString(depth: number): string {
        return 'string';
    }
}
