import { Definition } from './Definition.js';

export class BooleanTypeDefinition extends Definition<boolean> {
    override doMatchesStructure(value: unknown, _depth: number): boolean {
        return typeof value === 'boolean';
    }

    override doToTypeString(depth: number): string {
        return 'boolean';
    }
}
