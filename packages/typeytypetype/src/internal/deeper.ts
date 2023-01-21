export function deeper(depth: number): number {
    if (depth <= 0) {
        throw new Error('Depth limit exceeded');
    }
    return depth - 1;
}
